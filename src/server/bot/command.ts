import display from "./commands/display";
import ioweu from "./commands/ioweu";
import poke from "./commands/poke";
import uoweme from "./commands/uoweme";
import registerCommands from "./lib/register";

export const commands = [display, ioweu, poke, uoweme];

export const commandHandler = registerCommands(...commands);
