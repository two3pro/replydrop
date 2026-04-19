import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const manifestPath = path.join(root, "manifest.json");
const runtimeListPath = path.join(root, "scripts", "runtime-files.txt");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const version = String(manifest.version || "").trim();
const shortVersion = version.startsWith("0.") ? `p${version.slice(2)}` : version;
const zipPath = path.resolve(process.argv[2] || path.join(root, `replydrop-${shortVersion}.zip`));

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getRuntimeFiles() {
  return fs.readFileSync(runtimeListPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .sort();
}

assert(fs.existsSync(zipPath), `Packaged zip is missing: ${zipPath}`);

const runtimeFiles = getRuntimeFiles();
const zipEntries = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" })
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .sort();

const missingEntries = runtimeFiles.filter((entry) => !zipEntries.includes(entry));
const extraEntries = zipEntries.filter((entry) => !runtimeFiles.includes(entry));

assert(missingEntries.length === 0, `Packaged zip is missing runtime files: ${missingEntries.join(", ")}`);
assert(extraEntries.length === 0, `Packaged zip contains unexpected files: ${extraEntries.join(", ")}`);

const packagedManifest = JSON.parse(execFileSync("unzip", ["-p", zipPath, "manifest.json"], { encoding: "utf8" }));
assert(String(packagedManifest.version || "").trim() === version, `Packaged manifest version mismatch: expected ${version} got ${packagedManifest.version}`);

console.log(`Packaged release check passed for ${path.basename(zipPath)}.`);
