import { api } from "~/trpc/server";
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
    const tabAmount = await api.tab.getTabAmount.query({
      user1ID: caller.id,
      user2ID: target.id,
    });

    return tabAmount === 0
      ? `You and <@${target.id}> are settled up`
      : tabAmount > 0
      ? `You owe <@${target.id}> £${tabAmount}`
      : `<@${target.id}> pay your tab of £${tabAmount * -1} to <@${caller.id}>`;
  },
);

export default poke;
