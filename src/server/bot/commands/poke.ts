import { api } from "~/trpc/command";
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
    const tabAmount = await api.tab.getTabAmount({
      user1ID: caller.id,
      user2ID: target,
    });

    return tabAmount === 0
      ? `You and <@${target}> are settled up`
      : tabAmount > 0
      ? `You owe <@${target}> £${tabAmount}`
      : `<@${target}> pay your tab of £${tabAmount * -1} to <@${caller.id}>`;
  },
);

export default poke;
