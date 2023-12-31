import { z } from "zod";
import { getUserFromDiscordID, sorted } from "~/utils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { UserSchema } from "prisma/generated/zod";

export const tabRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ userID: z.string() }))
    .output(UserSchema.optional())
    .query(async ({ input: { userID }, ctx }) => {
      const acc = await ctx.db.account.findFirst({
        where: {
          providerAccountId: userID,
        },
      });

      if (acc === null) return undefined;

      const user = await ctx.db.user.findUnique({
        where: {
          id: acc.userId,
        },
      });

      if (user === null) return undefined;
      return user;
    }),

  getTabAmount: publicProcedure
    .input(
      z.object({
        user1: UserSchema,
        user2: UserSchema,
      }),
    )
    .output(z.number().optional())
    .query(async ({ input: { user1, user2 }, ctx }) => {
      const [userA, userB, flipped] = sorted(user1, user2);

      const tab = await ctx.db.tab.findUnique({
        where: {
          id: {
            userA_ID: userA.id,
            userB_ID: userB.id,
          },
        },
      });

      if (!tab) return undefined;

      return flipped ? -tab.amountOwed : tab.amountOwed;
    }),

  addToOrCreate: publicProcedure
    .input(
      z.object({
        amount: z.number().positive().finite(),
        debtorID: z.string(),
        creditorID: z.string(),
      }),
    )
    .output(z.number())
    .mutation(({ input: { debtorID, creditorID, amount }, ctx }) => {
      return amount;
      // const debtor = await getUserFromDiscordID(debtorID, ctx.db);
      // const creditor = await getUserFromDiscordID(creditorID, ctx.db);

      // const [userA, userB, flipped] = sorted(debtor, creditor);
      // const tab = await ctx.db.tab.upsert({
      //   where: {
      //     id: {
      //       userA_ID: userA.id,
      //       userB_ID: userB.id,
      //     },
      //   },
      //   create: {
      //     userA_ID: userA.id,
      //     userB_ID: userB.id,
      //     amountOwed: flipped ? -amount : amount,
      //   },
      //   update: {
      //     amountOwed: {
      //       increment: flipped ? -amount : amount,
      //     },
      //   },
      // });

      // const _transaction = await ctx.db.transaction.create({
      //   data: {
      //     tabUserA_ID: userA.id,
      //     tabUserB_ID: userB.id,

      //     amount: flipped ? -amount : amount,
      //   },
      // });

      // return flipped ? -tab.amountOwed : tab.amountOwed;
    }),

  clear: publicProcedure
    .input(
      z.object({
        user1ID: z.string(),
        user2ID: z.string(),
      }),
    )
    .mutation(async ({ input: { user1ID, user2ID }, ctx }) => {
      const user1 = await getUserFromDiscordID(user1ID, ctx.db);
      const user2 = await getUserFromDiscordID(user2ID, ctx.db);

      const [userA, userB, _] = sorted(user1, user2);

      const _tab = await ctx.db.tab.update({
        where: {
          id: {
            userA_ID: userA.id,
            userB_ID: userB.id,
          },
        },
        data: {
          amountOwed: 0,
        },
      });

      return 0;
    }),
});
