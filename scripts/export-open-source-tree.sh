#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

node scripts/check-open-source-export.mjs
node scripts/check-public-docs.mjs

VERSION="$(node -e 'process.stdout.write(require("./manifest.json").version)')"
SHORT_VERSION="${VERSION#0.}"
OUT_ROOT="$ROOT_DIR/open-source-export"
OUT_DIR="$OUT_ROOT/replydrop-open-source-p${SHORT_VERSION}"
LATEST_DIR="$OUT_ROOT/replydrop-open-source-latest"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

while IFS= read -r line; do
  trimmed="${line#"${line%%[![:space:]]*}"}"
  [[ -z "${trimmed// }" ]] && continue
  [[ "$trimmed" =~ ^# ]] && continue

  src="$ROOT_DIR/$trimmed"
  dest="$OUT_DIR/$trimmed"
  mkdir -p "$(dirname "$dest")"

  if [[ -d "$src" ]]; then
    cp -R "$src" "$dest"
  else
    cp "$src" "$dest"
  fi
done < "$ROOT_DIR/scripts/open-source-files.txt"

find "$OUT_DIR" -name '.DS_Store' -delete

cat > "$OUT_DIR/EXPORT_MANIFEST.txt" <<EOF
ReplyDrop clean open-source export
version=$VERSION
source_tree=$(basename "$ROOT_DIR")
generated_at=$(date '+%Y-%m-%d %H:%M:%S %Z')
EOF

rm -rf "$LATEST_DIR"
cp -R "$OUT_DIR" "$LATEST_DIR"

echo "Created clean export at $OUT_DIR"
