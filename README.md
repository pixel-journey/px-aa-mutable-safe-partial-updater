# Edit one mutable key without wiping the rest

> **Trust:** private educational lab (Tier B)  
> **Stack:** layer 2 of 5 — [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md)  
> **Sources:** [SOURCES.md](SOURCES.md)

**One-sentence goal:** Teach **full-map write** semantics: update one attribute key and **preserve every sibling**. That is the classic AtomicAssets mutable pitfall.

**Real code:** `npm test` (unit + **sequential composition**). **Does not** call AtomicAssets, serialize `ATTRIBUTE_MAP`, or write chain state.

On chain, `setassetdata` replaces the stored mutable blob with a serialization of the **entire** map you pass. Omitting a key is deleting it. See the [contract](https://github.com/pinknetworkx/atomicassets-contract) and [WAX mutable-data tutorial](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata).

## Composition note

`mutable.composition.test.ts` walks sequential patches: xp → level → new aura key, all without losing nickname. A naive `{ xp: 99 }` is an accidental wipe; `patchMutable` is not. Failed owner check leaves the row unchanged for retry.

## What you can learn

- Why a `setassetdata`-style write replaces the whole map, not one field.
- Why the previous map has to be an input you already read, not a map you invent with one key.
- Why a missing sibling key is an accidental wipe, even if the key you meant to change is present.
- Why the editor check is owner-only in this lab, and still not collection authority.

## What is actually in the repo

| Piece | Role |
| --- | --- |
| `invariants/mutable.ts` | `patchMutable`, `safeSetAssetData`, `isAccidentalWipe`, `assertNoWipe` |
| `invariants/mutable.test.ts` | Unit claims |
| `invariants/mutable.composition.test.ts` | Multi-step wipe vs safe path |
| `EDUCATION.md` | Read, copy, edit, write the full map |
| `SECURITY.md` | What a real `setassetdata` still needs |
| `SOURCES.md` | Official contract and docs.wax.io links |

## What is true (executed)

Starting map `{ xp: 10, nickname: "hero", level: 1 }` on asset `42n` owned by `alice`.

| Rule | Result |
| --- | --- |
| `patchMutable(..., "xp", 15)` | `xp` is 15; `nickname` and `level` stay |
| `patchMutable(..., "aura", true)` | new key added; `nickname` stays |
| Owner `alice` sets `xp` to 20 | patch kept; `assertNoWipe` passes |
| Editor `bob` | `only owner may edit` |
| Next map is only `{ xp: 1 }` | `isAccidentalWipe` is true |
| Sequential xp → level → aura | all prior keys still present |

## The rule, in order

1. Attribute keys match `^[a-z][a-z0-9_]{0,31}$`.
2. Values are `string`, finite `number`, or `boolean`. Strings longer than 256 are refused.
3. `patchMutable` copies `previous` and sets one key. It does not delete siblings.
4. `safeSetAssetData` requires the editor name to equal `row.owner`, and `assetId` to be a `bigint` ≥ 1.
5. `isAccidentalWipe` is true when `previous` had keys and `next` is missing at least one of them. An empty previous map is not a wipe.

## Best practice and the opposite

**Do** read the current mutable map, copy it, change one key, and write the full map back.  
**Do** refuse a next map that is missing a previous key.

**Do not** build a new object that contains only the field you wanted to change.  
**Do not** treat a passing owner check as AtomicAssets `setassetdata`. Collection auth and schema types are not in this repo.

## Stack neighbors

| Layer | Repo |
| --- | --- |
| 1 | [px-aa-mutable-deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) |
| 3 | [px-aa-mutable-all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) |
| 4 | [px-aa-mutable-vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) |
| 5 | [px-aa-mutable-rpg-xp-and-leveling](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling) |

## Run

```bash
npm test
```

MIT — Pixel Journey
