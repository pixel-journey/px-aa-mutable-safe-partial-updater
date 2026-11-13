# Worked examples

Run after reading [EDUCATION.md](EDUCATION.md). All numbers match the executed tests unless marked *exercise*.

## Example A — single key update

**Given** chain map:

```json
{ "xp": 10, "nickname": "hero", "level": 1 }
```

**Want:** set `xp` to 15.

| Approach | Next map | Result |
| --- | --- | --- |
| Naive | `{ "xp": 15 }` | Wipe of nickname and level |
| `patchMutable` | `{ "xp": 15, "nickname": "hero", "level": 1 }` | Safe |

`isAccidentalWipe(previous, naive)` → `true`.  
`isAccidentalWipe(previous, patched)` → `false`.

## Example B — sequential patches

Start as above. Apply in order: `xp → 15`, `level → 2`, `aura → true`.

Final map must still contain `nickname: "hero"`. This is what `mutable.composition.test.ts` locks.

## Example C — failed auth does not mutate

Row owned by `alice`. `safeSetAssetData(row, "bob", "xp", 1)` throws.  
`row.mutable` is unchanged. Retry with `alice` succeeds. Composition covers this.

## Example D — detector vs values

| Previous | Next | Wipe? | Why |
| --- | --- | --- | --- |
| `{ xp: 10, n: "a" }` | `{ xp: 11, n: "a" }` | No | Same keys |
| `{ xp: 10, n: "a" }` | `{ xp: 10 }` | Yes | Missing `n` |
| `{ }` | `{ xp: 1 }` | No | Empty previous cannot drop keys |
| `{ xp: 10 }` | `{ xp: 10, n: "a" }` | No | Adds a key |

## Example E — the lie about previous (*not* a passing test case)

If the client passes `previous = { xp: 10 }` while the chain still stores nickname, a “safe” patch to `{ xp: 15 }` still destroys nickname on write. **Lesson:** previous must be deserialized from the asset row in the same action. Documented in EDUCATION masterclass; do not implement a chain read in this repo.

## Example F — product auth variants (*design exercise*)

| Product | Who may edit XP? | Lab stand-in |
| --- | --- | --- |
| Player-only cosmetics | `asset.owner` | Current `safeSetAssetData` |
| Game server levels the NFT | Collection authorized editor | Replace owner check with collection auth list |
| Hybrid | Owner for nickname; collection for xp | Two paths, both full-map writes |

## Checklist before you ship a mutable write

1. Read asset row on contract (or in the same transaction you trust).
2. Deserialize with schema format.
3. Copy map → change keys → serialize **full** map.
4. `require_auth` matches your product (owner and/or collection).
5. Refuse schema type mismatches.
6. Optional: assert key set of next ⊇ key set of previous if your product never deletes attributes.
