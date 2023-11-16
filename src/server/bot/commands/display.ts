import { api } from "~/trpc/server";
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
    const tabAmount = await api.tab.getTabAmount.query({
      user1ID: caller.id,
      user2ID: target.id,
    });

    return tabAmount === 0
      ? `You and <@${target.id}> are settled up`
      : tabAmount > 0
      ? `You owe <@${target.id}> £${tabAmount}`
      : `<@${target.id}> owes you £${tabAmount * -1}`;
  },
);
