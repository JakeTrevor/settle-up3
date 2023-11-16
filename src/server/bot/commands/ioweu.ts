import { api } from "~/trpc/server";
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
    const tabAmount = await api.tab.addToOrCreate.mutate({
      amount: parseFloat(payment),
      debtorID: caller.id,
      creditorID: target.id,
    });

    const details =
      tabAmount === 0
        ? `<@${caller.id}> and <@${target.id}> are settled up`
        : tabAmount > 0
        ? `<@${caller.id}> owes <@${target.id}> £${tabAmount}`
        : `<@${target.id}> owes <@${caller.id}> £${tabAmount * -1}`;

    return `Added £${payment} to <@${caller.id}>'s tab with <@${target.id}>. ${details}`;
  },
);

export default ioweu;
