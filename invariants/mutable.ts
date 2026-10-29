/**
 * Safe partial mutable update (educational stand-in for AtomicAssets ATTRIBUTE_MAP).
 * Deserialize → edit one key → write full map back. Never drop sibling keys.
 */

export type AttrMap = Readonly<Record<string, string | number | boolean>>;

export type AssetRow = {
  assetId: bigint;
  owner: string;
  /** Chain-sourced previous map — must be passed in, not invented */
  mutable: AttrMap;
};

const NAME = /^[a-z1-5.]{1,12}$/;
const KEY = /^[a-z][a-z0-9_]{0,31}$/;

export function assertName(name: string): string {
  if (!NAME.test(name) || name.startsWith(".") || name.endsWith(".")) {
    throw new Error("bad account name");
  }
  return name;
}

export function assertKey(key: string): string {
  if (!KEY.test(key)) throw new Error("bad attribute key");
  return key;
}

/**
 * Apply a single key write onto a copy of the previous map.
 * Returns a new full map; all prior keys remain unless overwritten.
 */
export function patchMutable(
  previous: AttrMap,
  key: string,
  value: string | number | boolean
): AttrMap {
  assertKey(key);
  if (typeof value === "number" && !Number.isFinite(value)) {
    throw new Error("value must be finite");
  }
  if (typeof value === "string" && value.length > 256) {
    throw new Error("string value too long");
  }
  return { ...previous, [key]: value };
}

/**
 * Editor must be owner (educational). previous must be the provided chain-sourced map.
 */
export function safeSetAssetData(
  row: AssetRow,
  editor: string,
  key: string,
  value: string | number | boolean
): AssetRow {
  assertName(editor);
  if (editor !== row.owner) throw new Error("only owner may edit");
  if (typeof row.assetId !== "bigint" || row.assetId < 1n) {
    throw new Error("bad asset id");
  }
  // previous is required input — refuse empty object only when caller claims "wipe"
  const next = patchMutable(row.mutable, key, value);
  return { ...row, mutable: next };
}

/** Detect accidental wipe: next has fewer keys than previous and missing old keys. */
export function isAccidentalWipe(previous: AttrMap, next: AttrMap): boolean {
  const prevKeys = Object.keys(previous);
  const nextKeys = new Set(Object.keys(next));
  if (prevKeys.length === 0) return false;
  const missing = prevKeys.filter((k) => !nextKeys.has(k));
  return missing.length > 0;
}

/**
 * Guard used after patch: educational assert that patchMutable did not drop keys.
 */
export function assertNoWipe(previous: AttrMap, next: AttrMap): void {
  if (isAccidentalWipe(previous, next)) {
    throw new Error("mutable write would wipe sibling keys");
  }
}
