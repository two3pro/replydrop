import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const exportListPath = path.join(root, "scripts", "open-source-files.txt");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const forbiddenEntries = [
  /^HANDOFF-/,
  /^PRODUCT-GAP-/,
  /^replydrop-p\d/i,
  /^ScreenShot_/,
  /^IMG_/,
  /^open-source-export\//
];

assert(fs.existsSync(exportListPath), "scripts/open-source-files.txt is missing");

const entries = fs.readFileSync(exportListPath, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"));

assert(entries.length > 0, "scripts/open-source-files.txt is empty");

const duplicates = entries.filter((entry, index) => entries.indexOf(entry) !== index);
assert(duplicates.length === 0, `open-source export list has duplicates: ${duplicates.join(", ")}`);

for (const entry of entries) {
  assert(!forbiddenEntries.some((pattern) => pattern.test(entry)), `open-source export includes internal-only entry: ${entry}`);
  const absolutePath = path.join(root, entry);
  assert(fs.existsSync(absolutePath), `open-source export entry is missing: ${entry}`);
}

console.log("Open-source export list check passed.");
