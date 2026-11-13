# Tips and common mistakes

## Do

- Treat `setassetdata` as **replace map**, not **merge map**.
- Keep a typed “previous” from the asset row only.
- Write composition tests for multi-step edits (xp then level then new key).
- Document whether your game **allows deleting** attributes; if not, assert no missing keys.
- Link schema attribute types before allowing string/number coercion.

## Don’t

- Build `{ [changedKey]: value }` and send it as `new_mutable_data`.
- Trust a wallet or frontend to supply the full previous map.
- Assume `asset.owner` is the only valid editor for every collection.
- Confuse lab caps (string 256, etc.) with AtomicAssets consensus limits without checking the contract.
- Add a new micro-repo for “set energy” if it is the same full-map rule as XP — extend layer 5 instead.

## Debugging a wipe in the wild

1. Fetch the asset’s mutable data **before** and **after** the transaction (AtomicAssets API / Hyperion).
2. Diff keys, not only the field you intended to change.
3. Inspect the action’s `new_mutable_data` in the transaction — if siblings are absent there, the client or contract omitted them.
4. Confirm the contract path deserializes on-chain bytes rather than using notification memo JSON as previous.

## Teaching sequence

1. This repo (layer 2) — wipe vs patch.
2. [deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) — what the bytes mean.
3. [all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) + [vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) — legal values.
4. [rpg-xp-and-leveling](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling) — applied multi-field rule.

See [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).
