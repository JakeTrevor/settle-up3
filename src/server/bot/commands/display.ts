import { api } from "~/trpc/command";
import makeCommand from "../lib/makeCommand";
import { UserOption } from "../lib/options";

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
    const tabAmount = await api.tab.getTabAmount({
      user1ID: caller.id,
      user2ID: target,
    });

    return tabAmount === 0
      ? `You and <@${target}> are settled up`
      : tabAmount > 0
      ? `You owe <@${target}> £${tabAmount}`
      : `<@${target}> owes you £${tabAmount * -1}`;
  },
);
