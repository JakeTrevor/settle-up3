import display from "./commands/display";
import ioweu from "./commands/ioweu";
import poke from "./commands/poke";
import settleup from "./commands/settleup";
import uoweme from "./commands/uoweme";
import registerCommands from "./lib/register";

export const commands = registerCommands([
  display,
  ioweu,
  poke,
  settleup,
  uoweme,
]);
