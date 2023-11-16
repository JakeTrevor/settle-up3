import { type PrismaClient } from "@prisma/client";

export async function getUserFromDiscordID(ID: string, prisma: PrismaClient) {
  const acc = await prisma.account.findFirstOrThrow({
    where: {
      providerAccountId: ID,
    },
  });

  return prisma.user.findUniqueOrThrow({
    where: {
      id: acc.userId,
    },
  });
}
