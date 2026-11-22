# AI handoff — safe partial mutable update

## Agent tooling

```bash
git clone https://github.com/wharfkit/skill.git ~/.claude/skills/wharfkit
# AtomicAssets skills (not an MCP): pin a commit, start at AGENTS.md
# https://github.com/atomicassets/atomic-knowledge  → skills/atomic-integration, skills/report
```

| Tool | Role |
| --- | --- |
| [wharfkit/skill](https://github.com/wharfkit/skill) | SessionKit / ContractKit for a later host |
| [atomic-knowledge](https://github.com/atomicassets/atomic-knowledge) | Source-cited AA facts; network before action |
| [atomicassets-sdk](https://github.com/atomicassets/atomicassets-sdk) | Official TS read / serialize / v2 actions |
| [pinknetworkx/atomicassets-contract](https://github.com/pinknetworkx/atomicassets-contract) | `setassetdata` is a full map replace |
| [Serialization wiki](https://github.com/pinknetworkx/atomicassets-contract/wiki/Serialization) | Field id = schemaIndex + 4 |
| Stack index | [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md) |

## Non-negotiables

1. `setassetdata` **replaces the whole mutable map**. One-key next wipes every sibling on chain.
2. `patchMutable` is only safe when `previous` is the **real** previous map. A lied-about previous still wipes the row.
3. Patch at the **map** layer, then serialize the full result. Do not splice one field into an old blob.
4. This lab does not broadcast. Pure map merge only.
5. Full-map replace **ports** wherever AtomicAssets is deployed. Contract **version** does not: WAX mainnet remains V1-shaped until a `get_abi` says otherwise; WAX testnet is where V2 actions are exercisable.
6. Prefer WharfKit SessionKit over eosjs for any later host.

## Prompt seeds

- "Previous `{ xp, nickname, level }`, next only `{ xp: 99 }` — which keys die on chain?"
- "Show patchMutable that keeps nickname when only XP changes."
- "Explain why a client-supplied previous is not consensus."
- "Port this rule to another Antelope AA deployment without inventing mainnet V2."
- "Install atomic-integration and list which network you must pick before setassetdata."

## Do not

- Open a micro-repo for one scalar attribute.
- Claim mainnet supports every testnet V2 action because the account name matches.
- Put private keys in prompts.
- Call this a live chain write.
