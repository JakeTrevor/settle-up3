import { api } from "~/trpc/command";
import makeCommand from "../lib/makeCommand";
import { StringOption, UserOption } from "../lib/options";

const ioweu = makeCommand(
  {
    name: "ioweu",
    description: "Adds to your tab with another person",
    options: {
      target: UserOption({
        description: "Person you owe",
        required: true,
      }),
      payment: StringOption({
        description: "The amount you owe",
        required: true,
      }),
    },
  },
  async (caller, { target, payment }) => {
    const tabAmount = await api.tab.addToOrCreate({
      amount: parseFloat(payment),
      debtorID: caller.id,
      creditorID: target,
    });

    const details =
      tabAmount === 0
        ? `<@${caller.id}> and <@${target}> are settled up`
        : tabAmount > 0
        ? `<@${caller.id}> owes <@${target}> £${tabAmount}`
        : `<@${target}> owes <@${caller.id}> £${tabAmount * -1}`;

    return `Added £${payment} to <@${caller.id}>'s tab with <@${target}>. ${details}`;
  },
);

export default ioweu;
