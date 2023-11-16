import { type APIChatInputApplicationCommandInteraction } from "discord-api-types/v10";
import { type Command } from "./types";

function registerCommands(...commands: Command[]) {
  const collection = new Map<string, Command>();

  for (const com of commands) {
    collection.set(com.meta.name, com);
  }

  async function handler(i: APIChatInputApplicationCommandInteraction) {
    const commandName = i.data.name;
    const command = collection.get(commandName);

    if (!command) {
      console.error(`No command matching ${commandName} was found.`);
      return;
    }

    return await command.handler(i);
  }

  return { collection, handler };
}

export default registerCommands;
