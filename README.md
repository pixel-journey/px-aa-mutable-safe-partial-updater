# Edit one mutable key without wiping the rest

> **Trust:** private educational lab (Tier B)  
> **Quest:** 022 — safe partial mutable update  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach **full-map write** semantics: update one attribute key and **preserve every sibling**. That is the classic AtomicAssets mutable pitfall.

**Real code:** `npm test`. **Does not** call AtomicAssets, serialize `ATTRIBUTE_MAP`, or write chain state.

## What you can learn

- Why a `setassetdata`-style write replaces the whole map, not one field.
- Why the previous map has to be an input you already read, not a map you invent with one key.
- Why a missing sibling key is an accidental wipe, even if the key you meant to change is present.
- Why the editor check is owner-only in this lab, and still not collection authority.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `invariants/mutable.ts` | `patchMutable`, `safeSetAssetData`, `isAccidentalWipe`, `assertNoWipe` |
| `invariants/mutable.test.ts` | Executed claims |
| `EDUCATION.md` | Read, copy, edit, write the full map |
| `SECURITY.md` | What a real `setassetdata` still needs |

## What is true (executed)

Starting map `{ xp: 10, nickname: "hero", level: 1 }` on asset `42n` owned by `alice`.

| Rule | Result |
| --- | --- |
| `patchMutable(..., "xp", 15)` | `xp` is 15; `nickname` and `level` stay |
| `patchMutable(..., "aura", true)` | new key added; `nickname` stays |
| Owner `alice` sets `xp` to 20 | patch kept; `assertNoWipe` passes |
| Editor `bob` | `only owner may edit` |
| Next map is only `{ xp: 1 }` | `isAccidentalWipe` is true |

## The rule, in order

1. Attribute keys match `^[a-z][a-z0-9_]{0,31}$`.
2. Values are `string`, finite `number`, or `boolean`. Strings longer than 256 are refused.
3. `patchMutable` copies `previous` and sets one key. It does not delete siblings.
4. `safeSetAssetData` requires the editor name to equal `row.owner`, and `assetId` to be a `bigint` ≥ 1.
5. `isAccidentalWipe` is true when `previous` had keys and `next` is missing at least one of them. An empty previous map is not a wipe.

```ts
import { patchMutable, safeSetAssetData, isAccidentalWipe } from "./invariants/mutable.ts";

const prev = { xp: 10, nickname: "hero", level: 1 };
const next = patchMutable(prev, "xp", 15);
// next.nickname === "hero"

safeSetAssetData(
  { assetId: 42n, owner: "alice", mutable: prev },
  "alice",
  "xp",
  20
);

isAccidentalWipe(prev, { xp: 1 }); // true
```

## Edge cases

- Adding a key is not a wipe. Dropping a key is.
- `assertNoWipe` throws `mutable write would wipe sibling keys`. `patchMutable` itself does not drop keys; the detector exists so a bad next map can be rejected.
- Account-name checks are a format check, not a proof the account exists.
- The previous map is whatever the caller passed. This file does not fetch the asset row.

## Best practice and the opposite

**Do** read the current mutable map, copy it, change one key, and write the full map back.  
**Do** refuse a next map that is missing a previous key.

**Do not** build a new object that contains only the field you wanted to change.  
**Do not** treat a passing owner check as AtomicAssets `setassetdata`. Collection auth and schema types are not in this repo.

## Live path, not shipped

```
previous map (caller-supplied)
    → patchMutable / safeSetAssetData     [tested]
    → read asset row from AtomicAssets     [not in this repo]
    → setassetdata serialization           [not in this repo]
```

See [EDUCATION.md](EDUCATION.md) and [SECURITY.md](SECURITY.md).

## Related

- `px-aa-mutable-rpg-xp-and-leveling` — XP and level on a mutable map, including a partial-map wipe case
- Vault index: `px-contract-examples-vault`

## Run

```bash
npm test
```

MIT — Pixel Journey
