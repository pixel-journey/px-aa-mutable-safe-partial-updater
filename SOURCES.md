# Sources

## Official AtomicAssets / WAX

| Source | Use |
| --- | --- |
| [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) | `setassetdata` replaces the **full** mutable map |
| [WAX: Modifying mutable data](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata) | Action takes the ATTRIBUTE_MAP, not a patch |
| [WAX How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) | Standard overview |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | Bytes after the map is built |
| [atomicassets-sdk](https://github.com/atomicassets/atomicassets-sdk) | Official TS read / serialize |
| [atomic-knowledge](https://github.com/atomicassets/atomic-knowledge) | Pinned facts + skills `atomic-integration`, `report` |
| [docs.wax.io](https://docs.wax.io/) | Network docs |

## WharfKit

| Source | Use |
| --- | --- |
| [WharfKit](https://wharfkit.com/) | SessionKit when a host signs |
| [@wharfkit/atomicassets](https://www.npmjs.com/package/@wharfkit/atomicassets) | Asset / schema reads (inside wharfkit/js; standalone repo archived) |
| [wharfkit/skill](https://github.com/wharfkit/skill) | Claude Code skill — Session, Contract, patterns |
| [@wharfkit/cli](https://www.npmjs.com/package/@wharfkit/cli) | `generate atomicassets` typed helpers |
| [@wharfkit/starter-wax](https://www.npmjs.com/package/@wharfkit/starter-wax) | WAX SessionKit defaults |

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
```

## Product facts locked by this lab

- `setassetdata` is a **full replace**. A one-key object wipes every other key on the asset.
- `patchMutable` keeps siblings only when you pass the **real previous map**. A lied-about previous still wipes the chain row even if the pure function looks safe.
- Patch at the **map** layer, then serialize the full result. Do not splice one field into an old blob ([deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core)).
- This lab does not broadcast. The test is the rule for the map merge.

## Portability

The wipe is the full-map replace wherever AtomicAssets is deployed (WAX, EOS Jungle, XPR, Vaulta, …). **What does not port blindly:** which ABI version is live on that chain. WAX **mainnet** is still V1-shaped for many actions until `get_abi` says otherwise; WAX **testnet** is where V2 is exercisable. Matching account names across chains does not copy the ABI.

## Pixel Journey

| Source | Use |
| --- | --- |
| [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md) | Layer 1–5 order |
| [WIPE-BUG.md](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling/blob/main/WIPE-BUG.md) | Teaching write-up of partial wipe |
| [ANTELOPE-PORTABILITY.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/ANTELOPE-PORTABILITY.md) | Shared constants vs chain-local |

## Related labs

| Lab | Role |
| --- | --- |
| [deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core) | Bytes ↔ map |
| [all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types) | Scalar kinds |
| [vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) | Vector ops |
| [rpg-xp-and-leveling](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling) | Multi-field game rule |
