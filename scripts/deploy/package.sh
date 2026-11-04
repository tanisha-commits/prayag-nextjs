#!/usr/bin/env bash
# Build the upload zip for the server (cPanel → apps/incoming/). Usage:
#   bash scripts/deploy/package.sh            # builds with BASE_PATH=/prayagindia, then packages
#   SKIP_BUILD=1 bash scripts/deploy/package.sh  # package the existing .next build
# Includes admin-bootstrap.json (from `npm run admin:bundle`) when present, then removes the local copy.
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
rm -rf "$OUT/public" "$OUT/.next/static"           # symlinks from local test runs / traced copies, if any
cp -a .next/static "$OUT/.next/static"
cp -a public "$OUT/public"
rm -rf "$OUT/data" && mkdir "$OUT/data"            # the server keeps its own prayag.db
rm -rf "$OUT/dist"                                 # stray source-map references to older packages
rm -rf "$OUT/.next/cache/images" && mkdir -p "$OUT/.next/cache/images"
find "$OUT" -maxdepth 1 -name '.env*' ! -name '.env.production' -delete
if [ -f "$OUT/.env.production" ]; then             # ship only the public site URL
  grep '^BETTER_AUTH_URL=' "$OUT/.env.production" > "$OUT/.env.tmp" || true
  mv "$OUT/.env.tmp" "$OUT/.env.production"
fi

# Content edited locally (admin or Claude via MCP) travels with the package; the server merges it
# at start-up, keeping any newer edits made in the live admin.
npx tsx --env-file-if-exists=.env.local scripts/content/export.mts "$OUT/content-sync.json"
# Images uploaded locally (stored next to the local database) go along; the server copies new ones.
MEDIA_DIR="${PRAYAG_MEDIA_DIR:-$(dirname "${PRAYAG_DB_PATH:-data/prayag.db}")/media}"
if [ -d "$MEDIA_DIR" ]; then cp -a "$MEDIA_DIR" "$OUT/media-sync"; echo "Included $(find "$OUT/media-sync" -type f | wc -l) uploaded image(s)."; fi

if [ -f admin-bootstrap.json ]; then
  cp admin-bootstrap.json "$OUT/admin-bootstrap.json"
  rm -f admin-bootstrap.json
  echo "Included admin-bootstrap.json (applied once when the server starts)."
fi

cat > "$OUT/DEPLOY.md" <<EOF
# Prayag build $HASH ($(date +%F))

Built with \`BASE_PATH=/prayagindia\` and \`output: standalone\`. Serve it under \`/prayagindia\`.

## Run
    cd <this folder>
    PORT=3000 HOSTNAME=0.0.0.0 node server.js       # Node 24

## Environment (set on the server, not shipped here)
- BETTER_AUTH_SECRET  required (keep the server's existing value)
- PRAYAG_DB_PATH      path to the server's prayag.db (default: ./data/prayag.db)
- BETTER_AUTH_URL     in .env.production: https://drupal.abacusdesk.com/prayagindia

## Database
No database is included, so the server's existing prayag.db is used. Point PRAYAG_DB_PATH at it, or
copy it into ./data/ before starting. Without a database the app creates an empty one and the
category pages fail with a 500 error.

## Content
content-sync.json holds content edited locally (admin or Claude). At start-up the server merges it
(newer edits win, so live-admin changes since the export are kept), deletes it and re-renders all
pages from its own database. Look for [content-sync] and [startup] lines in the server log.

## Admin
If admin-bootstrap.json is present, the server creates or updates that admin once at start-up and
deletes the file. Look for an [admin-bootstrap] line in the server log.
EOF

(cd dist && zip -qry "$NAME.zip" "$NAME" && unzip -tq "$NAME.zip" >/dev/null)
echo "Ready: dist/$NAME.zip ($(du -h "dist/$NAME.zip" | cut -f1))"
