import { ChatAssistant } from "./classes/chat.ts";
import { Config } from "./classes/config.ts";
import type { UserChats, UserConfigs } from "./types.ts";

export const users = new Config<UserConfigs>("database/users.yml");
export const chats = new Config<UserChats>("database/chats.yml");
export const assistant = new ChatAssistant();
