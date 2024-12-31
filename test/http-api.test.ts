import { makeTestApp } from "@/testutils";
import { test, expect } from "bun:test";


test("http-api flow", async () => {
  const { api } = makeTestApp();

  const res1 = await api.create.post({
    content: "this is a reminder",
  }, {
    headers: {
      Authorization: "secret"
    }
  });

  expect(res1.status).toBe(201);
  const res2 = await api.pending.get({
    headers: {
      Authorization: "secret"
    }
  })
  expect(res2.status).toBe(200);
  const reminders1 = res2.data;

  if (reminders1 === null) {
    throw new Error("reminders was null");
  }

  expect(reminders1.length).toBe(1);
  expect(reminders1[0].content).toBe("this is a reminder");
  expect(reminders1[0].complete).toBe(false);
  const id = reminders1[0].id;

  const res3 = await api.complete.patch({
    id,
  }, {
    headers: {
      Authorization: "secret",
    }
  });

  expect(res3.status).toBe(201);
})
