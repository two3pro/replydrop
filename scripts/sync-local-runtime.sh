#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

TARGET_DIR="${1:-$ROOT_DIR/.local-runtime/brave-unpacked}"
RUNTIME_LIST="$ROOT_DIR/scripts/runtime-files.txt"

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

while IFS= read -r line; do
  [[ -z "${line// }" ]] && continue
  [[ "$line" =~ ^[[:space:]]*# ]] && continue

  SRC_PATH="$ROOT_DIR/$line"
  DEST_PATH="$TARGET_DIR/$line"

  if [[ ! -e "$SRC_PATH" ]]; then
    echo "Missing runtime file: $line" >&2
    exit 1
  fi

  mkdir -p "$(dirname "$DEST_PATH")"
  if [[ -d "$SRC_PATH" ]]; then
    rsync -a --delete "$SRC_PATH"/ "$DEST_PATH"/
  else
    cp -f "$SRC_PATH" "$DEST_PATH"
  fi
done < "$RUNTIME_LIST"

VERSION="$(node -e 'process.stdout.write(require("./manifest.json").version)')"
echo "$VERSION" > "$TARGET_DIR/.replydrop-version"
echo "Synced clean unpacked runtime to $TARGET_DIR"
