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
});

describe("isAccidentalWipe", () => {
  it("detects dropped keys", () => {
    assert.equal(isAccidentalWipe(prev, { xp: 1 }), true);
  });
});
