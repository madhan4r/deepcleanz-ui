#!/usr/bin/env bash
# Runs on the server. Usage: remote-deploy.sh <release-id> <path-to-release.tgz>
# Unpacks the release, switches `current`, reloads pm2, checks the site and rolls back if it fails.
set -euo pipefail
# Node and pm2 come from nvm on our server; non-interactive SSH does not load it.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
ID="$1"; TGZ="$2"
APP_DIR="${APP_DIR:-/var/www/deepcleanz}"
REL="$APP_DIR/releases/$ID"
KEEP=5

[ -f "$APP_DIR/shared/.env" ] || { echo "Missing $APP_DIR/shared/.env — see deploy/server-setup.md"; exit 1; }
mkdir -p "$APP_DIR/releases" "$APP_DIR/shared/media" "$APP_DIR/shared/logs"

rm -rf "$REL" && mkdir -p "$REL"
tar -xzf "$TGZ" -C "$REL" && rm -f "$TGZ"

PREV="$(readlink -f "$APP_DIR/current" 2>/dev/null || true)"
ln -sfn "$REL" "$APP_DIR/current.tmp" && mv -Tf "$APP_DIR/current.tmp" "$APP_DIR/current"

export APP_DIR
pm2 startOrReload "$REL/deploy/ecosystem.config.cjs" --update-env
pm2 save >/dev/null

# Health check: the home page reads the database, so 200 means app + DB are fine.
ok=0
for i in $(seq 1 30); do
  code="$(curl -s -o /dev/null -w '%{http_code}' -H 'Host: deepcleanz.com' http://127.0.0.1:3000/ || true)"
  [ "$code" = "200" ] && { ok=1; break; }
  sleep 2
done

if [ "$ok" != 1 ]; then
  echo "Health check failed (last status: ${code:-none}). Last log lines:"
  pm2 logs deepcleanz --err --lines 30 --nostream || true
  if [ -n "$PREV" ] && [ -d "$PREV" ]; then
    echo "Rolling back to $PREV"
    ln -sfn "$PREV" "$APP_DIR/current.tmp" && mv -Tf "$APP_DIR/current.tmp" "$APP_DIR/current"
    pm2 startOrReload "$PREV/deploy/ecosystem.config.cjs" --update-env
  fi
  exit 1
fi

# Keep the last $KEEP releases.
ls -1dt "$APP_DIR"/releases/*/ | tail -n +$((KEEP + 1)) | xargs -r rm -rf
echo "Deployed $ID"
