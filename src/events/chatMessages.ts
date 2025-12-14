import { ChannelType } from "discord.js";
import { Event } from "djs-bot-base";
import { assistant } from "../handlers.ts";

export default new Event({
  categoryName: "messageCreate",
  async run(message) {
    if (
      !process.env["CHAT_MODEL"] ||
      message.author.bot ||
      message.channel.type !== ChannelType.GuildText ||
      (process.env["CHAT_CHANNEL"] &&
        message.channelId !== process.env["CHAT_CHANNEL"]) ||
      (message.mentions.repliedUser?.id !== message.client.user.id &&
        !message.mentions.users.find(
          (user) => user.id === message.client.user.id,
        ))
    )
      return;

    const userId = message.author.id;

    // TODO: Add chat deletion

    const repliedMessage = await message.reply({
      content: "_⌛ düşünüyorum..._",
      allowedMentions: { parse: [] },
    });

    const assistantMessage = await assistant.sendMessage(
      userId,
      message.content,
    );

    if (!assistantMessage) {
      await repliedMessage.edit({
        content: "_Bir hata oluştu._",
        allowedMentions: { parse: [] },
      });
      return;
    }

    await repliedMessage.edit({
      content: assistantMessage,
      allowedMentions: { parse: [] },
    });
  },
});
