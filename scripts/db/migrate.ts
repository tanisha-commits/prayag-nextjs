// Apply pending Drizzle migrations to the local SQLite catalog database.
import { dbPath, migrateDb, openDb } from "../../src/lib/db/client";

const { db, sqlite } = openDb();
migrateDb(db);
sqlite.close();
console.log("migrated", dbPath);
