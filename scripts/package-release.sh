#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

node scripts/validate-release.mjs

VERSION="$(node -e 'process.stdout.write(require("./manifest.json").version)')"
SHORT_VERSION="${VERSION#0.}"
ZIP_NAME="replydrop-p${SHORT_VERSION}.zip"
ZIP_PATH="$ROOT_DIR/$ZIP_NAME"
DOWNLOADS_DIR="$ROOT_DIR/downloads"
DOWNLOADS_ZIP_PATH="$DOWNLOADS_DIR/$ZIP_NAME"

RUNTIME_FILES=()
while IFS= read -r line; do
  [[ -z "${line// }" ]] && continue
  [[ "$line" =~ ^[[:space:]]*# ]] && continue
  RUNTIME_FILES+=("$line")
done < "$ROOT_DIR/scripts/runtime-files.txt"

rm -f "$ZIP_PATH"
zip -q -X "$ZIP_PATH" "${RUNTIME_FILES[@]}"
mkdir -p "$DOWNLOADS_DIR"
cp "$ZIP_PATH" "$DOWNLOADS_ZIP_PATH"

INNER_VERSION="$(unzip -p "$ZIP_PATH" manifest.json | node -e 'const fs=require("node:fs"); const manifest=JSON.parse(fs.readFileSync(0,"utf8")); process.stdout.write(manifest.version)')"
if [[ "$INNER_VERSION" != "$VERSION" ]]; then
  echo "Packaged manifest version mismatch: expected $VERSION got $INNER_VERSION" >&2
  exit 1
fi

node scripts/check-packaged-release.mjs "$ZIP_PATH"

echo "Created $ZIP_NAME"
echo "Synced $DOWNLOADS_ZIP_PATH"
