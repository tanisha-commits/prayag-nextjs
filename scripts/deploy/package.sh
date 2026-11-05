#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."

if [ -n "$(git status --porcelain)" ]; then
  echo "Commit or stash your changes first (the zip name carries the commit hash)." >&2
  exit 1
fi

[ "${SKIP_BUILD:-}" = "1" ] || BASE_PATH=/prayagindia npm run build

HASH=$(git rev-parse --short HEAD)
NAME="prayagindia-$(date +%F)-$HASH"
OUT="dist/$NAME"
rm -rf "$OUT" "$OUT.zip"
mkdir -p dist

cp -a .next/standalone "$OUT"
rm -f "$OUT/public" "$OUT/.next/static"
cp -a .next/static "$OUT/.next/static"
cp -a public "$OUT/public"
rm -rf "$OUT/.next/cache/images" && mkdir -p "$OUT/.next/cache/images"
find "$OUT" -maxdepth 1 -name '.env*' -delete

cat > "$OUT/DEPLOY.md" <<DOC
# Prayag build $HASH ($(date +%F))

Built with \`BASE_PATH=/prayagindia\` and \`output: standalone\`. Serve it under \`/prayagindia\`.

## Run
    cd <this folder>
    PORT=3000 HOSTNAME=0.0.0.0 node server.js       # Node 24

## Environment (optional, set on the server)
- PRAYAG_ENQUIRY_FORWARDING and the PRAYAG_* lead API keys for the contact and dealership forms.

No database and no admin: all content, including the product catalog, is part of this build.
DOC

(cd dist && zip -qry "$NAME.zip" "$NAME" && unzip -tq "$NAME.zip" >/dev/null)
echo "Ready: dist/$NAME.zip ($(du -h "dist/$NAME.zip" | cut -f1))"
