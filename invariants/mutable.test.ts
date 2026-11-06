import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  patchMutable,
  safeSetAssetData,
  isAccidentalWipe,
  assertNoWipe,
} from "./mutable.ts";

const prev = { xp: 10, nickname: "hero", level: 1 };

describe("patchMutable", () => {
  it("updates one key and keeps siblings", () => {
    const next = patchMutable(prev, "xp", 15);
    assert.equal(next.xp, 15);
    assert.equal(next.nickname, "hero");
    assert.equal(next.level, 1);
    assert.equal(isAccidentalWipe(prev, next), false);
  });

  it("can add a new key without dropping old ones", () => {
    const next = patchMutable(prev, "aura", true);
    assert.equal(next.aura, true);
    assert.equal(next.nickname, "hero");
  });

  it("refuses a bad key", () => {
    assert.throws(() => patchMutable(prev, "XP", 1), /bad attribute key/);
    assert.throws(() => patchMutable(prev, "1xp", 1), /bad attribute key/);
  });

  it("refuses non-finite numbers and long strings", () => {
    assert.throws(() => patchMutable(prev, "xp", Number.NaN), /finite/);
    assert.throws(() => patchMutable(prev, "nickname", "x".repeat(257)), /too long/);
  });
});

describe("safeSetAssetData", () => {
  const row = {
    assetId: 42n,
    owner: "alice",
    mutable: prev,
  };

  it("owner may patch", () => {
    const updated = safeSetAssetData(row, "alice", "xp", 20);
    assert.equal(updated.mutable.xp, 20);
    assert.equal(updated.mutable.nickname, "hero");
    assertNoWipe(prev, updated.mutable);
  });

  it("non-owner refused", () => {
    assert.throws(() => safeSetAssetData(row, "bob", "xp", 99), /only owner/);
  });

  it("refuses asset id below 1", () => {
    assert.throws(
      () => safeSetAssetData({ ...row, assetId: 0n }, "alice", "xp", 1),
      /bad asset id/,
    );
  });
});

describe("isAccidentalWipe", () => {
  it("detects dropped keys", () => {
    assert.equal(isAccidentalWipe(prev, { xp: 1 }), true);
  });

  it("empty previous is not a wipe", () => {
    assert.equal(isAccidentalWipe({}, { xp: 1 }), false);
  });

  it("assertNoWipe throws on a partial next map", () => {
    assert.throws(() => assertNoWipe(prev, { xp: 1 }), /wipe sibling/);
  });
});
