import type {
  APIUser,
  APIChatInputApplicationCommandInteraction,
  Snowflake,
} from "discord-api-types/v10";
import { type Option } from "./options";
import { type Message } from "./message";

export interface CommandMeta<T extends Record<string, Option>> {
  name: string;
  description: string;
  options: T;
}

export interface Command {
  meta: CommandMeta<Record<string, Option>>;
  handler: InteractionHandler;
}

export type InteractionHandler = (
  i: APIChatInputApplicationCommandInteraction,
) => string | Message | Promise<string | Message>;

export type ArgHandler<Options extends Record<string, Option>> = (
  caller: APIUser,
  args: argsFor<Options>,
) => string | Message | Promise<string | Message>;

export type argsFor<Options extends Record<string, Option>> = {
  [arg in keyof Options]: Options[arg]["required"] extends true
    ? getArgType<Options[arg]["type"]>
    : getArgType<Options[arg]["type"]> | undefined;
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
  ? Snowflake
  : never;
