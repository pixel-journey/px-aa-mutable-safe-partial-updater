# Education — partial mutable updates

> **Rung:** `npm test` passes. Nothing calls AtomicAssets, and nothing serializes `ATTRIBUTE_MAP`.  
> **The test is the rule.** The dangerous part of this pattern is a previous map the caller invented. This course says that out loud.

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Update one key and keep the others, and recognize a wiped map |
| Intermediate | Walk `patchMutable`, `safeSetAssetData`, and `isAccidentalWipe` |
| Masterclass | Explain why a caller-supplied `previous` can still wipe a chain row, and what `setassetdata` requires |

Neighbor with the same pitfall on XP: `px-aa-mutable-rpg-xp-and-leveling`.

---

## Beginner — one scene

An NFT has mutable data `{ xp: 10, nickname: "hero", level: 1 }`. You want to set `xp` to 15. AtomicAssets-style `setassetdata` replaces the **whole** map. If you send only `{ xp: 15 }`, nickname and level are gone.

This lab copies the previous map, sets one key, and writes the copy back:

```text
{ xp: 15, nickname: "hero", level: 1 }
```

The tests assert nickname and level survive. Adding `aura: true` also keeps nickname. Replacing the map with `{ xp: 1 }` makes `isAccidentalWipe` true.

Only `alice`, the owner on the row, may call `safeSetAssetData`. `bob` gets `only owner may edit`.

### Words

| Word | Meaning here |
| --- | --- |
| Previous | The map you claim was already there |
| Patch | `{ ...previous, [key]: value }` |
| Wipe | Next is missing at least one key that previous had |
| Owner | A string compared to `row.owner`. Not a signature |

### Predict, then run

```bash
npm test
```

1. After the owner sets `xp` to 20, nickname is still `"hero"`.
2. `isAccidentalWipe` on an empty previous is false. You cannot "drop" keys that were not there.
3. A new key is not a wipe.

---

## Intermediate — the guards that are real, and the one that is only as good as `previous`

### Keys and values

Keys match `^[a-z][a-z0-9_]{0,31}$`. Values are string, finite number, or boolean. Strings longer than 256 throw. Non-finite numbers throw. The tests do not exercise the regex or the length cap.

### `safeSetAssetData`

Well-formed editor name, editor equals `row.owner`, `assetId` is a `bigint` ≥ 1, then `patchMutable`. It does not call `assertNoWipe`. The owner test calls `assertNoWipe` itself after a honest patch. A correct patch does not need the detector. The detector exists so a bad next map can be rejected.

### `isAccidentalWipe`

True when previous has at least one key and next is missing any of them. It does not compare values. Changing `xp` from 10 to 15 is not a wipe. It does not know which keys the schema requires. It only compares the two objects you handed it.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Write `{ xp: 15 }` only | Nickname gone | spread previous, then set | `updates one key and keeps siblings` |
| Stranger edits | Grief | `only owner may edit` | `non-owner refused` |
| Next map dropped keys | Silent wipe | `isAccidentalWipe` true | `detects dropped keys` |

---

## Masterclass — the wipe that still typechecks

`safeSetAssetData` trusts `row.mutable`. The comment says it must be chain-sourced. The function cannot check that. If the caller builds:

```text
row.mutable = { xp: 10 }          // nickname already omitted
safeSetAssetData(..., "xp", 15)   // next is { xp: 15 }
isAccidentalWipe({ xp: 10 }, { xp: 15 })  // false
```

the detector is happy and the chain row, which still had `nickname`, gets replaced by `{ xp: 15 }` **if you serialize `next` and not the chain row**. The bug moved one step earlier: lying about previous. The tests never do this. They pass the full map.

So the educational sequence is not "call patch." It is:

1. Read the asset from the chain (or from the table you just loaded in the same action).
2. Deserialize that blob, not a blob the user passed.
3. Copy, edit one key, serialize the full map.
4. If you keep a detector, compare against the bytes you read in step 1.

### What AtomicAssets still requires

Not in this repo:

- Collection authorization, which is often not the same as the current NFT owner.
- Schema types. A string written into a uint32 attribute fails at deserialization. The RPG neighbor refuses a string where a uint32 is required. This lab allows string, number, and boolean with no schema.
- `holds_alternative` before `std::get` on the variant. The vault standard names that specifically because a wrong type is a trap, not a quiet overwrite.
- The real `setassetdata` action and its serialization. Returning a JavaScript object does not write a row.

Owner-only is a teaching stand-in. Some games want the collection to update XP while the player owns the NFT. If you copy `editor !== row.owner` into that game, the collection cannot level the asset. If you delete the check, anyone can. The authorization has to match the product, and it has to be `require_auth`, not a string.

### Exercise

1. Previous `{ xp: 10, nickname: "hero" }`, next `{ xp: 10 }`. Wipe? (Yes.)
2. Previous `{ xp: 10 }`, next `{ xp: 11, nickname: "hero" }`. Wipe? (No. A lie about previous can make a real wipe look like an add.)
3. Does `patchMutable` delete keys? (No. The detector is for maps that did not come from `patchMutable`.)

---

## What this course will not teach

- A live `setassetdata`
- That owner-only matches every collection's auth
- That `isAccidentalWipe` can see the chain
