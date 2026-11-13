/**
 * Composition: sequential full-map patches never wipe siblings.
 * A naive partial object is an accidental wipe; safe path keeps all keys.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  assertNoWipe,
  isAccidentalWipe,
  patchMutable,
  safeSetAssetData,
  type AssetRow,
  type AttrMap,
} from "./mutable.ts";

const start: AttrMap = { xp: 10, nickname: "hero", level: 1 };

describe("composition: sequential safe patches", () => {
  it("three sequential patches preserve all sibling keys", () => {
    let row: AssetRow = { assetId: 42n, owner: "alice", mutable: start };
    row = safeSetAssetData(row, "alice", "xp", 15);
    assert.deepEqual(row.mutable, { xp: 15, nickname: "hero", level: 1 });
    assertNoWipe(start, row.mutable);

    row = safeSetAssetData(row, "alice", "level", 2);
    assert.equal(row.mutable.xp, 15);
    assert.equal(row.mutable.nickname, "hero");
    assert.equal(row.mutable.level, 2);

    row = safeSetAssetData(row, "alice", "aura", true);
    assert.equal(row.mutable.xp, 15);
    assert.equal(row.mutable.nickname, "hero");
    assert.equal(row.mutable.level, 2);
    assert.equal(row.mutable.aura, true);
    assert.equal(isAccidentalWipe(start, row.mutable), false);
  });

  it("naive partial object is a wipe; patch path is not", () => {
    const naive = { xp: 99 } as AttrMap;
    assert.equal(isAccidentalWipe(start, naive), true);
    assert.throws(() => assertNoWipe(start, naive), /wipe sibling/);

    const safe = patchMutable(start, "xp", 99);
    assert.equal(isAccidentalWipe(start, safe), false);
    assert.equal(safe.nickname, "hero");
    assert.equal(safe.level, 1);
  });

  it("failed unauthorized edit leaves row unchanged for retry", () => {
    const row: AssetRow = { assetId: 42n, owner: "alice", mutable: start };
    assert.throws(
      () => safeSetAssetData(row, "bob", "xp", 1),
      /only owner/,
    );
    assert.deepEqual(row.mutable, start);
    const next = safeSetAssetData(row, "alice", "xp", 20);
    assert.equal(next.mutable.xp, 20);
    assert.equal(next.mutable.nickname, "hero");
  });

  it("overwrite same key twice keeps other keys", () => {
    let map = start;
    map = patchMutable(map, "xp", 11);
    map = patchMutable(map, "xp", 12);
    assert.equal(map.xp, 12);
    assert.equal(map.nickname, "hero");
    assert.equal(map.level, 1);
    assertNoWipe(start, map);
  });
});
