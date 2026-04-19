import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const runtimeListPath = path.join(root, "scripts", "runtime-files.txt");
const manifestPath = path.join(root, "manifest.json");
const packageJsonPath = path.join(root, "package.json");
const changelogPath = path.join(root, "CHANGELOG.md");
const readmePath = path.join(root, "README.md");

function readUtf8(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: "inherit" });
}

function getRuntimeFiles() {
  return readUtf8(runtimeListPath)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function getTestFiles() {
  const testsDir = path.join(root, "tests");
  return fs.readdirSync(testsDir)
    .filter((entry) => entry.endsWith(".test.cjs"))
    .sort()
    .map((entry) => path.join("tests", entry));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const manifest = JSON.parse(readUtf8(manifestPath));
const packageJson = JSON.parse(readUtf8(packageJsonPath));
const version = String(manifest.version || "").trim();
const shortVersion = version.startsWith("0.") ? `p${version.slice(2)}` : version;

assert(version, "manifest.json is missing version");
assert(String(packageJson.version || "").trim() === version, "package.json version does not match manifest.json");
assert(fs.existsSync(runtimeListPath), "scripts/runtime-files.txt is missing");
assert(fs.existsSync(changelogPath), "CHANGELOG.md is missing");
assert(fs.existsSync(readmePath), "README.md is missing");

const runtimeFiles = getRuntimeFiles();
assert(runtimeFiles.length > 0, "runtime file list is empty");

for (const relativeFile of runtimeFiles) {
  const absoluteFile = path.join(root, relativeFile);
  assert(fs.existsSync(absoluteFile), `Missing runtime file: ${relativeFile}`);
}

for (const relativeFile of runtimeFiles.filter((file) => file.endsWith(".js"))) {
  run("node", ["--check", relativeFile]);
}

run("node", ["--test", ...getTestFiles()]);
run("node", ["scripts/check-public-docs.mjs"]);
run("node", ["scripts/check-doc-links.mjs"]);
run("node", ["scripts/check-open-source-export.mjs"]);

const changelog = readUtf8(changelogPath);
assert(changelog.includes(`## ${version}`), `CHANGELOG.md is missing heading for ${version}`);

const readme = readUtf8(readmePath);
assert(readme.includes(`\`${version}\``), `README.md does not mention version ${version}`);
assert(readme.includes(`replydrop-${shortVersion}.zip`), `README.md does not mention replydrop-${shortVersion}.zip`);

console.log(`ReplyDrop ${version} validation passed.`);
