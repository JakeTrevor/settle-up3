import {
  type APIApplicationCommandInteractionDataBasicOption,
  type APIChatInputApplicationCommandInteraction,
} from "discord-api-types/v10";
import { type Option } from "./options";
import { type Command, type CommandMeta, type HandlerOf } from "./types";

const makeCommand = <T extends Record<string, Option>>(
  meta: CommandMeta<T>,
  handler: HandlerOf<T>,
) => {
  return {
    meta,
    handler: wrapper(meta, handler),
  } as Command;
};

const wrapper =
  <T extends Record<string, Option>>(
    meta: CommandMeta<T>,
    handler: HandlerOf<T>,
  ) =>
  async (i: APIChatInputApplicationCommandInteraction) => {
    type handlerArgType = Parameters<typeof handler>[1];

    const args = Object.entries(meta.options).reduce((acc, [optionName]) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = (
        i.data.options?.filter(
          (e) => e.name === optionName,
        )[0] as APIApplicationCommandInteractionDataBasicOption
      )?.value;

      return {
        ...acc,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        [optionName]: value,
      };
    }, {} as handlerArgType);

    const user = (i.member?.user ?? i.user)!;

    return await handler(user, args);
  };

export default makeCommand;
