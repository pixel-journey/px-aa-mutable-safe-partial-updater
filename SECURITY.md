# Security — full-map mutable writes

This lab is pure TypeScript. Treat the table as a threat model for production `setassetdata`, not as a claim that the lab enforces chain security.

## Closed in tests

| Threat | Lab behavior |
| --- | --- |
| Partial map wipe | `patchMutable` spreads `previous` then sets one key |
| Detect dropped keys | `isAccidentalWipe` / `assertNoWipe` |
| Unauthorized editor | `editor === row.owner` |
| Bad asset id | `bigint` and `>= 1` |
| Bad attribute key | regex `^[a-z][a-z0-9_]{0,31}$` |
| Non-finite number / overlong string | refused |

## Not closed (production)

| Threat | Required on chain |
| --- | --- |
| Caller invents `previous` | Load asset row; deserialize **on-contract** bytes; never trust client map as previous |
| Collection vs owner | Collection auth for game leveling — not only `asset.owner` |
| Schema type mismatch | Serialize with schema format; refuse wrong kinds before write |
| Replay / stale read | Same-action read → mutate → write |
| Missing require_auth | Real authority on the action |
| RAM / serialization limits | Bound map size and string lengths to what AtomicAssets accepts |

## Attack angles

1. **Honest patch** — previous `{ xp, nickname, level }`, set `xp` → all three keys remain. Detector false.
2. **Client partial** — next `{ xp: 99 }` only → detector true; production would delete nickname/level if that object were serialized.
3. **Lying previous** — client passes previous `{ xp: 10 }` while chain still has nickname → detector can be false while the write still wipes the chain row. **The only fix is a chain-sourced previous.**
4. **Stranger editor** — `bob` on alice’s row → refused in lab; production still needs the real auth path for collection-driven XP updates.
5. Mixing this lab's **allow new keys** policy with RPG layer 5's **refuse new keys** policy.

## Honesty limits

`isAccidentalWipe` only compares the two objects you handed it — it cannot see the chain. Owner-only is a teaching stand-in. Official: [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) · [mutable data](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata). Stack: [MUTABLE-STACK](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md) · [WIPE-BUG](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling/blob/main/WIPE-BUG.md).
