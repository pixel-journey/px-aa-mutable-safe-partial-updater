# px-aa-mutable-safe-partial-updater

> **Trust:** private educational lab (Tier B)  
> **Quest:** 022 — safe partial mutable update  
> **Vault:** [px-contract-examples-vault](https://github.com/pixel-journey/px-contract-examples-vault)

**One-sentence goal:** Teach **full-map write** semantics: update one attribute key and **preserve every sibling** (the classic AtomicAssets mutable pitfall).

**Real code:** `npm test`. **Does not** call AtomicAssets or write chain state.

---

## What is true (executed)

| Rule | Result |
|------|--------|
| `patchMutable` xp | nickname/level kept |
| Owner edit | ok |
| Non-owner | refused |
| Dropped sibling keys | detected as accidental wipe |

```bash
npm test
```

Neighbor: `px-aa-mutable-rpg-xp-and-leveling`.

## License

MIT — Pixel Journey
