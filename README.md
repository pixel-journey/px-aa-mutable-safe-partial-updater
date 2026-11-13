# Edit one mutable key without wiping the rest

> **Stack:** layer 2 of 5 — [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md)  
> **Sources:** [SOURCES.md](SOURCES.md)

**Goal:** Teach **full-map write** semantics for AtomicAssets mutables: change one attribute and **preserve every sibling**. That is the classic `setassetdata` pitfall.

**Code under test:** `npm test` (unit + sequential composition). This lab is pure TypeScript: it does not call AtomicAssets or write chain state.

On chain, `setassetdata` replaces the stored mutable blob with a serialization of the **entire** map you pass. Omitting a key deletes it. See the [contract](https://github.com/pinknetworkx/atomicassets-contract) and the [WAX mutable-data tutorial](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata).

## Composition

`mutable.composition.test.ts` walks sequential patches (xp → level → aura) without losing nickname. A naive `{ xp: 99 }` is an accidental wipe; `patchMutable` is not. A failed owner check leaves the row unchanged for retry.

## Learning outcomes

- Why a `setassetdata`-style write replaces the whole map, not one field.
- Why the previous map must be read from the asset row, not invented with a single key.
- Why a missing sibling key is an accidental wipe.
- Why an owner check is not the same as collection `authorized_editor` authority.

## Implemented rules

| Piece | Role |
| --- | --- |
| `invariants/mutable.ts` | `patchMutable`, `safeSetAssetData`, `isAccidentalWipe`, `assertNoWipe` |
| `invariants/mutable.test.ts` | Unit claims |
| `invariants/mutable.composition.test.ts` | Multi-step wipe vs safe path |
| `EDUCATION.md` / `SECURITY.md` / `SOURCES.md` | Pedagogy, threat model, official links |

Starting map `{ xp: 10, nickname: "hero", level: 1 }` on asset `42n` owned by `alice`:

| Rule | Result |
| --- | --- |
| `patchMutable(..., "xp", 15)` | `xp` is 15; `nickname` and `level` stay |
| `patchMutable(..., "aura", true)` | new key; siblings stay |
| Owner `alice` sets `xp` to 20 | patch kept; `assertNoWipe` passes |
| Editor `bob` | refused |
| Next map only `{ xp: 1 }` | `isAccidentalWipe` is true |

## Run

```bash
npm test
```

## Stack neighbors

| Layer | Repo |
| --- | --- |
| 1 | [px-aa-mutable-deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) |
| 3 | [px-aa-mutable-all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) |
| 4 | [px-aa-mutable-vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) |
| 5 | [px-aa-mutable-rpg-xp-and-leveling](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling) |

MIT — Pixel Journey
