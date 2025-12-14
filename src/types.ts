export type UserConfigs = Partial<Record<string, UserData>>;

export interface UserData {
  realName?: string;
}

export type UserChats = Record<string, UserChat>;

export type ChatRoles = "user" | "system" | "assistant";

export interface UserChat {
  locked?: boolean;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  role: ChatRoles;
  content: string;
}
