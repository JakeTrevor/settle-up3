import { z } from "zod";
import { sorted } from "~/utils";
import { createTRPCRouter, publicProcedure } from "../trpc";

import { and, eq } from "drizzle-orm";
import {
  NewTransactionSchema,
  UserSchema,
  accounts,
  tab as db_tab,
  transaction as db_transaction,
  users,
} from "~/server/db";

export const tabRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ userID: z.string() }))
    .output(UserSchema.optional())
    .query(async ({ input: { userID }, ctx }) => {
      const acc = await ctx.db.query.accounts.findFirst({
        where: eq(accounts.providerAccountId, userID),
      });

      if (!acc) return undefined;

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, acc.userId),
      });

      if (!user) return undefined;
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

      const tab = await ctx.db.query.tab.findFirst({
        where: and(
          eq(db_tab.user_A_ID, userA.id),
          eq(db_tab.user_B_ID, userB.id),
        ),
      });

      if (!tab) return undefined;

      return flipped ? -tab.amountOwed : tab.amountOwed;
    }),

  createTransaction: publicProcedure
    .input(NewTransactionSchema)
    .mutation(async ({ input: transactionData, ctx }) => {
      const {
        tab_user_A_ID: user_A_ID,
        tab_user_B_ID: user_B_ID,
        amount,
      } = transactionData;
      // get or create tab
      const tab = await ctx.db.query.tab.findFirst({
        where: and(
          eq(db_tab.user_A_ID, user_A_ID),
          eq(db_tab.user_B_ID, user_B_ID),
        ),
      });

      if (tab) {
        await ctx.db
          .update(db_tab)
          .set({
            amountOwed: tab.amountOwed + amount,
          })
          .where(
            and(
              eq(db_tab.user_A_ID, user_A_ID),
              eq(db_tab.user_B_ID, user_B_ID),
            ),
          );
      } else {
        await ctx.db.insert(db_tab).values({
          amountOwed: amount,
          user_A_ID: user_A_ID,
          user_B_ID: user_B_ID,
        });
      }

      const transaction = await ctx.db
        .insert(db_transaction)
        .values(transactionData)
        .returning();

      return transaction;
    }),
});
