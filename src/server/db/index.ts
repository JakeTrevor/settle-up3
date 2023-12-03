import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import * as schema from "./schema";
import { sorted } from "~/utils";

export const db = drizzle(sql, { schema });
export type DB = typeof db;

export const UserSchema = createSelectSchema(schema.users);
export const TabSchema = createSelectSchema(schema.tab);
export const NewTabSchema = createInsertSchema(schema.tab);
export const TransactionSchema = createSelectSchema(schema.transaction);
export const NewTransactionSchema = createInsertSchema(schema.transaction, {
  amount: z.number().nonnegative(),
})
  .omit({
    ID: true,
    code: true,
    createdAt: true,
    tab_user_A_ID: true,
    tab_user_B_ID: true,
  })
  .extend({ debtor: UserSchema, creditor: UserSchema })
  .transform(({ debtor, creditor, amount, pending, ref }) => {
    const [userA, userB, flipped] = sorted(debtor, creditor);
    // TODO: If pending, should also add a code

    const tabChange = pending ? 0 : flipped ? -amount : amount;
    return {
      ref,
      pending,
      amount: tabChange,
      tab_user_A_ID: userA.id,
      tab_user_B_ID: userB.id,
    };
  });

export type Tab = z.infer<typeof TabSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type User = z.infer<typeof UserSchema>;

export * from "./schema";
