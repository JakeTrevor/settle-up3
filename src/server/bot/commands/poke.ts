import { api } from "~/trpc/command";
import { validateCallerAndTarget } from "~/utils/bot/validateCallerAndTarget";
import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";

const poke = makeCommand(
  {
    name: "poke",
    description: "Asks someone to pay their tab",
    options: {
      target: UserOption({
        description: "Person to poke",
        required: true,
      }),
    },
  },

  async (caller, { target }) => {
    const res = await validateCallerAndTarget(caller, target);

    if (res.status === "error") return res.message;

    const [callerAccount, targetAccount] = res.data;

    const tabAmount = await api.tab.getTabAmount({
      user1: callerAccount,
      user2: targetAccount,
    });

    if (tabAmount === undefined) return `You and <@${target}> have no tab`;

    return tabAmount === 0
      ? `You and <@${target}> are settled up`
      : tabAmount > 0
      ? `You owe <@${target}> £${tabAmount}`
      : `<@${target}> pay your tab of £${tabAmount * -1} to <@${caller.id}>`;
  },
);

export default poke;
