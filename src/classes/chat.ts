import ollama from "ollama";
import type { ChatMessage } from "../types.ts";
import { chats } from "../handlers.ts";
import { isString } from "@wyntine/verifier";

export class ChatAssistant {
  private systemMessage: ChatMessage | undefined;
  private model: string;

  constructor() {
    const systemPrompt = process.env["SYSTEM_PROMPT"] ?? "";
    this.systemMessage =
      isString(systemPrompt) && systemPrompt.length ?
        this.createSystemMessage(systemPrompt)
      : undefined;

    const model = process.env["CHAT_MODEL"];

    if (!model) {
      throw new Error("Please give a chat model to use");
    }

    this.model = model;
  }

  public async sendMessage(
    userId: string,
    message: string,
  ): Promise<string | undefined> {
    const newUserMessage = this.createUserMessage(message);
    const userData = chats.get(userId);

    if (userData?.locked) return;

    chats.overwriteKey(userId, { locked: true });

    const userMessages = (userData?.messages ?? [this.systemMessage]).filter(
      (msg) => msg !== undefined,
    );

    const response = await ollama.chat({
      model: this.model,
      messages: [...userMessages, newUserMessage],
    });

    const newAssistantMessage = this.createAssistantMessage(
      response.message.content,
    );

    const finalMessages = [
      ...userMessages,
      newUserMessage,
      newAssistantMessage,
    ];

    chats.overwriteKey(userId, { locked: false, messages: finalMessages });

    return newAssistantMessage.content;
  }

  private createUserMessage(message: string): ChatMessage {
    return { role: "user", content: message };
  }

  private createAssistantMessage(message: string): ChatMessage {
    return { role: "assistant", content: message };
  }

  private createSystemMessage(message: string): ChatMessage {
    return { role: "system", content: message };
  }
}
