import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const authRoleEnum = pgEnum("auth_role", ["farmer", "fpo", "admin"]);

export const authSessions = pgTable(
  "auth_sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    userId: text("user_id").notNull(),
    role: authRoleEnum("role").notNull(),
    displayName: text("display_name").notNull(),
    identity: text("identity").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).defaultNow().notNull(),
  },
  (table) => [index("auth_sessions_expires_at_idx").on(table.expiresAt)],
);