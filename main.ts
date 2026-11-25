// One childhood memory in a single sentence, written for the make.fun
// bounty "Make the AI Judge Feel Nostalgic: A Childhood Memory".
// The program prints the entry to stdout and writes it, with no trailing
// newline, to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt),
// where the sealed scorer reads it. Stdlib only, no network, deterministic.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "On summer evenings my grandmother lifted the lid off the rice pot, and the steam fogged my glasses as she filled my chipped blue bowl, while cicadas sang beyond her kitchen window and none of us knew how much I would miss that sound.";

const MAX_CHARS = 280;

// Count in code points so any non-ASCII character counts once, as the
// sealed scorer counts characters. The gate wants one sentence of 1-280
// characters, so also insist on a single terminal full stop.
const charCount = [...ENTRY].length;
const sentenceCount = (ENTRY.match(/[.!?]/g) ?? []).length;
if (charCount === 0 || charCount > MAX_CHARS || ENTRY.trim().length === 0) {
  throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${charCount}`);
}
if (sentenceCount !== 1 || !ENTRY.endsWith(".")) {
  throw new Error(`entry must be a single sentence, found ${sentenceCount} terminators`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
// The file gets the bare entry, no trailing newline; stdout may carry one.
writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
process.stdout.write(ENTRY + "\n");
