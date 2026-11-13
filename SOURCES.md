# Official sources

| Source | Use |
| --- | --- |
| [atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) | `setassetdata` serializes the **entire** `new_mutable_data` map into `mutable_serialized_data` |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | ATTRIBUTE_MAP → bytes using schema format; field id = varint(index + 4) |
| [WAX: Modifying mutable data](https://docs.wax.io/build/tutorials/howto_atomicassets/mutabledata) | Client-side map shape and action parameters |
| [WAX: How-To AtomicAssets](https://docs.wax.io/build/tutorials/howto_atomicassets) | Standard overview on WAX |
| [WAX: Minting NFTs](https://docs.wax.io/build/tutorials/howto_atomicassets/mint_nft) | Initial mutable vs immutable data |
| [WAX API reference](https://docs.wax.io/build/api-reference/) | AtomicAssets / Hyperion reads for the asset row |

## Stack position

Layer **2 of 5**. Previous: [deserialize-core](https://github.com/pixel-journey/px-aa-mutable-deserialize-core). Next: [all-primitive-types](https://github.com/pixel-journey/px-aa-mutable-all-primitive-types). Applied rule: [rpg-xp-and-leveling](https://github.com/pixel-journey/px-aa-mutable-rpg-xp-and-leveling). Path: [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).

## Related labs

| Repo | Connection |
| --- | --- |
| [px-aa-mutable-vector-arrays-crud](https://github.com/pixel-journey/px-aa-mutable-vector-arrays-crud) | Vector elements still need full-map write |
| [wax-atomic-template-and-schema-explorer](https://github.com/pixel-journey/wax-atomic-template-and-schema-explorer) | Byte previews for schema attributes |
| [wax-atomicassets-v2-action-previews](https://github.com/pixel-journey/wax-atomicassets-v2-action-previews) | v2 action shapes (not mutable math) |
