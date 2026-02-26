import { ChatAssistant } from "./classes/chat.ts";
import { Config } from "./classes/config.ts";
import type { UserChats, UserConfigs } from "./types.ts";

export const users = new Config<UserConfigs>("db/users.yml");
export const chats = new Config<UserChats>("db/chats.yml");
export const assistant = new ChatAssistant();
