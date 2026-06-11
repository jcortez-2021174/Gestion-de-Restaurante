import test from "node:test";
import assert from "node:assert/strict";
import {
  cachedGet,
  invalidateRequestCache,
} from "../src/shared/apis/request-cache.js";

test("deduplicates simultaneous GET requests and serves the short cache", async () => {
  let calls = 0;
  const client = {
    get: async () => {
      calls += 1;
      await new Promise((resolve) => setTimeout(resolve, 10));
      return { status: 200, data: { ok: true } };
    },
  };

  const [first, second] = await Promise.all([
    cachedGet(client, "/dashboard/stats", {}, 1000),
    cachedGet(client, "/dashboard/stats", {}, 1000),
  ]);
  const third = await cachedGet(client, "/dashboard/stats", {}, 1000);

  assert.equal(calls, 1);
  assert.equal(first, second);
  assert.equal(second, third);
  invalidateRequestCache("/dashboard");
});
