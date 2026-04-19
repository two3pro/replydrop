import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const files = [
  "README.md",
  "CONTRIBUTING.md",
  "SUPPORT.md",
  "RELEASING.md"
];
const forbiddenPatterns = [
  /\/Users\//,
  /\/home\//,
  /[A-Z]:\\\\Users\\\\/i,
  /file:\/\//i
];

const violations = [];

for (const relativeFile of files) {
  const absoluteFile = path.join(root, relativeFile);
  const content = fs.readFileSync(absoluteFile, "utf8");
  content.split(/\r?\n/).forEach((line, index) => {
    if (forbiddenPatterns.some((pattern) => pattern.test(line))) {
      violations.push(`${relativeFile}:${index + 1} ${line.trim()}`);
    }
  });
}

if (violations.length) {
  throw new Error(`Public docs still contain local-machine paths or file URLs:\\n${violations.join("\\n")}`);
}

console.log("Public-doc path check passed.");
