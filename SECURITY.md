# Security notes

| Issue | Lab mitigation |
|-------|----------------|
| Partial map wipe | spread previous then set key |
| Unauthorized editor | owner-only |
| Invented previous state | previous is an explicit argument (must be chain-sourced in production) |

Production still needs collection auth, schema types, and real `setassetdata` serialization.
