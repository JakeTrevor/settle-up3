import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  foreignKey,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const pgTable = pgTableCreator((name) => `settle-up4_${name}`);

export const tab = pgTable(
  "tab",
  {
    user_A_ID: text("user_A_ID")
      .references(() => users.id)
      .notNull(),
    user_B_ID: text("user_B_ID")
      .references(() => users.id)
      .notNull(),
    amountOwed: real("amount_owed").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.user_A_ID, table.user_B_ID] }),
    user_A_ID_index: index("user_A_ID_index").on(table.user_A_ID),
    user_B_ID_index: index("user_B_ID_index").on(table.user_B_ID),
  }),
);

export const transaction = pgTable(
  "transaction",
  {
    ID: serial("id").primaryKey(),
    tab_user_A_ID: text("tab_user_A_ID").notNull(),
    tab_user_B_ID: text("tab_user_B_ID").notNull(),
    amount: real("amount").notNull(),

    code: text("code"),
    pending: boolean("pending").default(false).notNull(),
    ref: text("ref").notNull(),
    createdAt: date("created_at").defaultNow(),
  },
  (table) => ({
    tabReference: foreignKey({
      columns: [table.tab_user_A_ID, table.tab_user_B_ID],
      foreignColumns: [tab.user_A_ID, tab.user_B_ID],
    }),

    tab_user_A_ID_index: index("tab_user_A_ID_index").on(table.tab_user_A_ID),
    tab_user_B_ID_index: index("tab_user_B_ID_index").on(table.tab_user_B_ID),
    tab_index: index("tab_index").on(table.tab_user_A_ID, table.tab_user_B_ID),
  }),
);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
