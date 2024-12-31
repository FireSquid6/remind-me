import { startApp } from "@/app";
import { getConfig } from "@/config";
import { getDb, migrateDb } from "@/db/index";

const db = getDb("database.sqlite")
migrateDb(db);
const config = getConfig({
  port: 3220,
})

startApp(config, db);
