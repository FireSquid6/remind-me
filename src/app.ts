import { Elysia, t } from "elysia";
import type { Config } from "./config";
import type { Database } from "./db/index";
import { remindersTable } from "./db/schema";
import { eq } from "drizzle-orm";

interface Kit {
  config: Config;
  db: Database
}

export const app = new Elysia()
  .state("kit", {} as Kit) // this is dangerous but ok!
  .guard({
    async beforeHandle(ctx) {
      const secret = ctx.store.kit.config.secret; 
      const authorization = ctx.request.headers.get("Authorization");
      if (authorization !== secret) {
        ctx.set.status = 401;
        return;
      }
    }
  }, (app) => app
    .get("/pending", async (ctx) => {
      const { db } = ctx.store.kit;
      const pending = await db.select().from(remindersTable).where(eq(remindersTable.complete, false));
      return pending;
    })
    .patch("/complete", async (ctx) => {
      const { id } = ctx.body;
      const { db } = ctx.store.kit;

      const updated = await db.update(remindersTable)
        .set({ complete: true })
        .where(eq(remindersTable.id, id))
        .returning({ id: remindersTable.id });

      if (updated.length === 0) {
        ctx.set.status === 400;
      } else {
        ctx.set.status = 201;
      }
    }, {
      body: t.Object({
        id: t.Number(),
      }),
    })
    .post("/create", async (ctx) => {
      const { content } = ctx.body;
      const { db } = ctx.store.kit;
      const createdAt = new Date();

      await db.insert(remindersTable).values({
        createdAt,
        content,
      });
      ctx.set.status = 201;
    }, {
      body: t.Object({
        content: t.String(),
      })
    }))

export type App = typeof app;

export function startApp(config: Config, db: Database) {
  app.store.kit = {
    config,
    db,
  }

  app.listen(config.port, () => {
    console.log(`App started on port ${config.port}`);
  });
}
