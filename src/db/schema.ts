import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const remindersTable = sqliteTable("reminders_table", {
  id: int("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  complete: int("complete", { mode: "boolean" }).notNull().default(false),
  createdAt: int("created_at", { mode: "timestamp_ms" }).notNull(),
})

export type Reminder = InferSelectModel<typeof remindersTable>
export type InsertReminder = InferInsertModel<typeof remindersTable>
