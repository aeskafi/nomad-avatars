import { test } from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { resolveWorkspacePackages } from "../../scripts/lib/workspace.mjs";

const ROOT = resolve(import.meta.dirname, "../..");
const results = resolveWorkspacePackages(ROOT);

test("resolveWorkspacePackages finds @dicebear/core", () => {
  assert.ok(results.some((p) => p.includes("src/js/core/package.json")));
});

test("resolveWorkspacePackages finds @dicebear/converter", () => {
  assert.ok(results.some((p) => p.includes("src/js/converter/package.json")));
});

test("resolveWorkspacePackages finds the CLI package (dicebear)", () => {
  assert.ok(results.some((p) => p.includes("src/js/cli/package.json")));
});

test("resolveWorkspacePackages does not include root package.json", () => {
  const rootPkgJson = resolve(ROOT, "package.json");
  assert.ok(!results.includes(rootPkgJson));
});

test("resolveWorkspacePackages finds all app packages", () => {
  assert.ok(results.some((p) => p.includes("apps/editor/package.json")));
  assert.ok(results.some((p) => p.includes("apps/docs/package.json")));
});
