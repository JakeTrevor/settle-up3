import { APIUser } from "discord-api-types/v10";
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
    // validate caller and target

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

async function validateCallerAndTarget(caller: APIUser, target: string) {
  const callerAccount = await api.tab.getUser({ userID: caller.id });
  if (!callerAccount)
    return {
      status: "error" as const,
      message: "Please sign up for a settleup account",
    };

  const targetAccount = await api.tab.getUser({ userID: target });
  if (!targetAccount)
    return {
      status: "error" as const,
      message: `<@${target}> does not have a settleup account`,
    };

  return {
    status: "success" as const,
    data: [callerAccount, targetAccount] as const,
  };
}
