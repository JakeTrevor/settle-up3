import { eq } from "drizzle-orm";
import { type DB, type User, accounts, users } from "~/server/db";

export async function getUserFromDiscordID(
  ID: string,
  db: DB,
): Promise<User | undefined> {
  const acc = await db.query.accounts.findFirst({
    where: eq(accounts.providerAccountId, ID),
  });

  if (!acc) return undefined;

  const user = await db.query.users.findFirst({
    where: eq(users.id, acc.userId),
  });

  return user;
}
