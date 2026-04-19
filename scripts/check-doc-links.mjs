import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const exportListPath = path.join(root, "scripts", "open-source-files.txt");
const linkPattern = /!?\[[^\]]*]\(([^)]+)\)/g;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getExportEntries() {
  return fs.readFileSync(exportListPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function collectMarkdownFiles(entryPath) {
  const stats = fs.statSync(entryPath);
  if (stats.isFile()) {
    return entryPath.endsWith(".md") ? [entryPath] : [];
  }

  if (!stats.isDirectory()) {
    return [];
  }

  return fs.readdirSync(entryPath, { withFileTypes: true })
    .flatMap((item) => collectMarkdownFiles(path.join(entryPath, item.name)));
}

function normalizeTarget(rawTarget) {
  return rawTarget
    .trim()
    .replace(/^<|>$/g, "")
    .split("#")[0]
    .split("?")[0];
}

function shouldSkipTarget(target) {
  return !target ||
    target.startsWith("#") ||
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("mailto:") ||
    target.startsWith("data:");
}

assert(fs.existsSync(exportListPath), "scripts/open-source-files.txt is missing");

const markdownFiles = getExportEntries()
  .flatMap((entry) => collectMarkdownFiles(path.join(root, entry)))
  .map((absolutePath) => path.relative(root, absolutePath))
  .filter((entry, index, array) => array.indexOf(entry) === index)
  .sort();

const brokenLinks = [];

for (const relativeFile of markdownFiles) {
  const absoluteFile = path.join(root, relativeFile);
  const content = fs.readFileSync(absoluteFile, "utf8");
  const fileDir = path.dirname(absoluteFile);

  for (const match of content.matchAll(linkPattern)) {
    const rawTarget = match[1] || "";
    const target = normalizeTarget(rawTarget);
    if (shouldSkipTarget(target)) {
      continue;
    }

    const resolved = path.resolve(fileDir, target);
    if (!fs.existsSync(resolved)) {
      brokenLinks.push(`${relativeFile} -> ${rawTarget}`);
    }
  }
}

assert(brokenLinks.length === 0, `Broken markdown links or assets found:\n${brokenLinks.join("\n")}`);

console.log("Markdown link check passed.");
