import { type APIUser } from "discord-api-types/v10";
import { Ephemeral } from "~/server/bot/lib/message";
import { api } from "~/trpc/command";

export async function validateCallerAndTarget(caller: APIUser, target: string) {
  const callerAccount = await api.tab.getUser({ userID: caller.id });
  if (!callerAccount)
    return {
      status: "error" as const,
      message: Ephemeral("Please sign up for a settleup account"),
    };

  const targetAccount = await api.tab.getUser({ userID: target });
  if (!targetAccount)
    return {
      status: "error" as const,
      message: Ephemeral(`<@${target}> does not have a settleup account`),
    };

  return {
    status: "success" as const,
    data: [callerAccount, targetAccount] as const,
  };
}
