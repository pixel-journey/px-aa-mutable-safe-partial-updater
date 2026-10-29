# Education

`setassetdata` style APIs typically replace the **entire** mutable blob. If you build a new map with only the key you care about, you **wipe** nickname, durability, and every other field.

**Correct sequence**

1. Read / deserialize the current map (chain-sourced `previous`)
2. Copy it
3. Change one key
4. Write the **full** map back

This lab encodes that with `patchMutable` + owner checks + wipe detection.
