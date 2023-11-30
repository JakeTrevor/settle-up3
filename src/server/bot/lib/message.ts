import { MessageFlags } from "discord-api-types/v10";

export interface Message {
  content: string;
  flags?: MessageFlags;
}

export function Message(content: string): Message {
  return { content };
}

export function Ephemeral(content: string): Message {
  return { content, flags: MessageFlags.Ephemeral };
}
