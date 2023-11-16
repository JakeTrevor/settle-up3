import {
  type DiscordUser,
  type DiscordInteraction,
} from "~/utils/bot/interactionSchema";
import { type Option } from "./options";

export interface CommandMeta<T extends Record<string, Option>> {
  name: string;
  description: string;
  options: T;
}

export interface Command {
  meta: CommandMeta<Record<string, Option>>;
  handler: GenericHandler;
}

export type GenericHandler = (
  i: DiscordInteraction,
) => string | Promise<string>;

export type HandlerOf<T extends Record<string, Option>> = (
  caller: DiscordUser,
  args: argsFor<T>,
) => string | Promise<string>;

export type argsFor<T extends Record<string, Option>> = {
  [arg in keyof T]: T[arg]["required"] extends true
    ? getArgType<T[arg]["type"]>
    : getArgType<T[arg]["type"]> | undefined;
};

type getArgType<T> = T extends 3
  ? string
  : T extends 10
  ? number
  : T extends 4
  ? number
  : T extends 5
  ? boolean
  : T extends 6
  ? DiscordUser
  : never;