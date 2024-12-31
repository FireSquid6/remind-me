import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { Database as BunDatabase } from "bun:sqlite";

export type Database = ReturnType<typeof getDb>;

export function getDb(filename: string) {
  const sqlite = new BunDatabase(filename);
  const db = drizzle({ client: sqlite });
  return db;
}

export function migrateDb(db: Database) {
  migrate(db, { migrationsFolder: "drizzle" });
}
