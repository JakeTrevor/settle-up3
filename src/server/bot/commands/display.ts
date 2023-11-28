import { api } from "~/trpc/command";
import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";
import { validateCallerAndTarget } from "~/utils/bot/validateCallerAndTarget";

export default makeCommand(
  {
    name: "display",
    description: "Shows the tab between you and another person",
    options: {
      target: UserOption({
        description: "Person you want to see your tab with",
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

    return tabAmount === 0
      ? `You and <@${target}> are settled up`
      : tabAmount > 0
      ? `You owe <@${target}> £${tabAmount}`
      : `<@${target}> owes you £${tabAmount * -1}`;
  },
);
