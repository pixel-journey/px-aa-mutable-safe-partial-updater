# Security notes — full-map mutable writes

This lab is pure TypeScript. Treat the table as a threat model for production `setassetdata`, not as a claim that the lab enforces chain security.

## Mitigated in the lab (tested)

| Threat | Lab behavior | Where |
| --- | --- | --- |
| Partial map wipe | `patchMutable` spreads `previous` then sets one key | `mutable.ts` |
| Detect dropped keys | `isAccidentalWipe` / `assertNoWipe` | unit + composition tests |
| Unauthorized editor | `editor === row.owner` | `safeSetAssetData` |
| Bad asset id | `bigint` and `>= 1` | `safeSetAssetData` |
| Bad attribute key | regex `^[a-z][a-z0-9_]{0,31}$` | `assertKey` |
| Non-finite number / overlong string | refused | `patchMutable` |

## Not mitigated here (production must add)

| Threat | Required on chain |
| --- | --- |
| Caller invents `previous` | Load asset row; deserialize **on-contract** bytes; never trust client map as previous |
| Collection vs owner | `check_has_collection_auth` (or your product’s editor list), not only `asset.owner` |
| Schema type mismatch | Serialize with schema format; refuse wrong kinds before write |
| Replay / stale read | Same-action read → mutate → write; do not use a stale off-chain snapshot |
| Missing require_auth | `require_auth(authorized_editor)` on the real action |
| RAM / serialization limits | Bound map size and string lengths to what AtomicAssets accepts |

## Attack walkthrough

1. **Honest patch** — previous `{ xp, nickname, level }`, set `xp` → all three keys remain. Detector false.
2. **Client partial** — next `{ xp: 99 }` only → detector true; production would delete nickname/level if that object were serialized.
3. **Lying previous** — client passes previous `{ xp: 10 }` while chain still has nickname → detector can be false while the write still wipes the chain row. **The only fix is a chain-sourced previous.**
4. **Stranger editor** — `bob` on alice’s row → refused in lab; production still needs the real auth path for collection-driven XP updates.

## Related reading in this org

| Doc / repo | Why |
| --- | --- |
| [WIPE-BUG.md](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling/blob/main/WIPE-BUG.md) | Same wipe, applied to RPG fields |
| [COLLECTION-AUTH.md](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling/blob/main/COLLECTION-AUTH.md) | Why owner auth is not always enough |
| [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md) | Five-layer path |
