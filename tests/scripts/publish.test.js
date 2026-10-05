import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldPublish } from "../../scripts/lib/publish.mjs";

test("shouldPublish skips private packages", () => {
  const result = shouldPublish({ name: "@dicebear/editor", version: "1.0.0", private: true }, null);
  assert.strictEqual(result.publish, false);
  assert.match(result.reason, /private/);
});

test("shouldPublish skips when registry version matches local version", () => {
  const result = shouldPublish({ name: "@dicebear/core", version: "1.0.0" }, "1.0.0");
  assert.strictEqual(result.publish, false);
  assert.match(result.reason, /already published/);
});

test("shouldPublish publishes when versions differ", () => {
  const result = shouldPublish({ name: "@dicebear/core", version: "2.0.0" }, "1.0.0");
  assert.strictEqual(result.publish, true);
  assert.match(result.reason, /version changed/);
});

test("shouldPublish publishes when package is new on registry", () => {
  const result = shouldPublish({ name: "@dicebear/new-style", version: "1.0.0" }, null);
  assert.strictEqual(result.publish, true);
  assert.match(result.reason, /new package/);
});
