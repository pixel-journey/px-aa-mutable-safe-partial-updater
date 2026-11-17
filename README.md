# Safe partial mutable updater (anti-wipe)

Educational AtomicAssets lesson: `setassetdata` **replaces** the mutable map. Always copy previous, set one key, write the full map. Detect accidental key drops.

| Doc | Role |
| --- | --- |
| [EDUCATION.md](EDUCATION.md) | Wipe vs patch |
| [WORKED-EXAMPLES.md](WORKED-EXAMPLES.md) | Sibling survival |
| [TIPS.md](TIPS.md) | Debugging wipes in the wild |
| [SECURITY.md](SECURITY.md) | Lied-about previous |
| [SOURCES.md](SOURCES.md) | Official + stack |

Stack layer 2 — [MUTABLE-STACK.md](https://github.com/pixel-journey/px-contract-examples-vault/blob/main/docs/MUTABLE-STACK.md).

```bash
npm test
```

MIT — Pixel Journey
