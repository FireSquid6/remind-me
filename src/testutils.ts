import { treaty } from "@elysiajs/eden";
import { getConfig } from "./config";
import { getDb, migrateDb } from "./db";
import { startApp, type App } from "./app";


export function makeTestApp() {
  const db = getDb(":memory:");
  migrateDb(db);

  const config = getConfig({
    secret: "secret",
    port: 7813,
  })
  
  startApp(config, db);

  const api = treaty<App>("http://localhost:7813")
  return {
    api,
    db,
  }
}
