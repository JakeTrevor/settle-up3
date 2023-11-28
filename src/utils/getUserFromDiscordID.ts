import { User, type PrismaClient } from "@prisma/client";

export async function getUserFromDiscordID(
  ID: string,
  prisma: PrismaClient,
): Promise<User> {
  const acc = await prisma.account.findFirstOrThrow({
    where: {
      providerAccountId: ID,
    },
  });

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: acc.userId,
    },
  });

  return user;
}
