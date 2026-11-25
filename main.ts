// Entry for "Make the AI Judge Feel Nostalgic: A Childhood Memory".
// One sentence, one childhood memory: riding home from school on my
// father's old bicycle. The program assembles the sentence from its
// parts, checks it against the gate, and writes it to
// $MAKEFUN_OUTPUT_DIR/entry.txt with no trailing newline.
// Node 22, standard library only, no network, fully deterministic.

import * as fs from "node:fs";
import * as path from "node:path";

// How the sentence is glued together: beats separated by ", ", closed by ".".
const SEPARATOR = ", ";
const TERMINATOR = ".";

// The memory, in four named beats: the routine, the perch, the senses, the ache.
// Kept as separate named fragments (not one long literal) so each beat can
// be read — and revised — on its own.
const MEMORY_PARTS = {
  routine:
    "Every afternoon my father pedalled me home from school on his old bicycle",
  perch: "and I stood on the back pegs with my arms around his waist",
  senses:
    "counting the cracks in the road as the smell of rain on hot asphalt rose around us",
  ache: "and I never once thought to ask him to ride slower",
} as const;

const LIMIT = 280;

// Assemble the entry from the named beats, in story order.
function composeMemorySentence(parts: typeof MEMORY_PARTS): string {
  const beatsInOrder = [parts.routine, parts.perch, parts.senses, parts.ache];
  return beatsInOrder.join(SEPARATOR) + TERMINATOR;
}

// Count sentence terminators (., !, ?) anywhere in the text.
function countSentenceTerminators(text: string): number {
  return Array.from(text).filter((ch) => ".!?".includes(ch)).length;
}

// Gate checks, in a different order from the first draft: sentence shape
// first (exactly one sentence, ending in a full stop), then whitespace,
// then length last.
function validateGate(text: string): void {
  if (countSentenceTerminators(text) !== 1 || !text.endsWith(TERMINATOR)) {
    throw new Error("entry must be exactly one sentence ending in a full stop");
  }
  if (text.trim() !== text) {
    throw new Error("entry has leading or trailing whitespace");
  }
  const length = Array.from(text).length;
  if (length < 1 || length > LIMIT) {
    throw new Error(`entry length ${length} is outside the 1-${LIMIT} range`);
  }
}

function writeEntryFile(text: string): void {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, "entry.txt");
  fs.writeFileSync(target, text, { encoding: "utf8" });
  // Read the file back and confirm it holds exactly the entry, nothing more.
  const written = fs.readFileSync(target, { encoding: "utf8" });
  if (written !== text) {
    throw new Error("entry.txt does not match the entry exactly");
  }
}

function main(): void {
  const entry = composeMemorySentence(MEMORY_PARTS);
  validateGate(entry);
  writeEntryFile(entry);
  console.log(entry);
}

main();
