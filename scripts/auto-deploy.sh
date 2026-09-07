#!/bin/bash
# Installed root-owned outside the checkout. Builds run as the gallery account.
set -euo pipefail
exec 9>/run/lock/gpt-image2-deploy.lock
flock -n 9 || exit 0
cd /var/www/gpt-image2
as_gallery() { sudo -u gpt-image2 "$@"; }
as_gallery git fetch origin main --quiet
next=$(git rev-parse origin/main)
current=$(cat /var/lib/gpt-image2/deployed-revision 2>/dev/null || git rev-parse HEAD)
[ "$next" != "$current" ] || exit 0
# Only deploy a main commit that passed the repository's validation workflow.
if ! python3 - "$next" <<'PY'
import json,sys,urllib.request
sha=sys.argv[1]
url='https://api.github.com/repos/irons163/awesome-gpt-image-2-zh/actions/workflows/check.yml/runs?branch=main&event=push&head_sha='+sha
r=urllib.request.Request(url,headers={'User-Agent':'gpt-image2-deploy'})
with urllib.request.urlopen(r,timeout=20) as response: runs=json.load(response)['workflow_runs']
sys.exit(0 if any(r['head_sha']==sha and r['conclusion']=='success' for r in runs) else 1)
PY
then
  echo 'Waiting for successful main validation.'
  exit 0
fi
as_gallery git merge --ff-only "$next"
if ! (as_gallery npm ci && as_gallery npm run build -- --outDir dist-next); then
  echo 'Build failed; existing dist remains live.' >&2
  exit 1
fi
rm -rf dist-previous
mv dist dist-previous
mv dist-next dist
systemctl restart gpt-image2.service
if ! curl --retry 5 --retry-connrefused --retry-delay 1 -fsS http://172.17.0.1:4174/ >/dev/null; then
  mv dist dist-failed
  mv dist-previous dist
  systemctl restart gpt-image2.service
  exit 1
fi
printf '%s\n' "$next" > /var/lib/gpt-image2/deployed-revision
echo "Deployed $next"
