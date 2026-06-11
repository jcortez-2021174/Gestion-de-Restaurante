import test from "node:test";
import assert from "node:assert/strict";
import {
  AUTH_STORAGE_KEY,
  clearPersistedSession,
} from "../src/features/auth/auth.storage.js";

test("logout cleanup removes authentication and cart persistence", () => {
  const removed = [];
  const storage = {
    removeItem: (key) => removed.push(key),
  };

  clearPersistedSession(storage);

  assert.deepEqual(removed, [AUTH_STORAGE_KEY, "carrito-aurea"]);
});
