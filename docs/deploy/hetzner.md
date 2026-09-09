# Hetzner deployment

This guide runs the site on the existing Hetzner VPS at `178.105.194.250` and
keeps the existing site in `/var/www/zero2codex` untouched. The example site
path for this repository is `/var/www/gpt-image2`.

The public hostname is `gpt-image.zero2codex.dev`. The previous
`gpt-image2.zero2codex.dev` hostname remains as a redirect so existing links
continue to work. Cloudflare publishes both hostnames with A records pointing
to `178.105.194.250`.
This VPS already runs Caddy in Docker Compose from `/opt/caddy`. Caddy
terminates HTTPS, serves the Vite build from a read-only bind mount, and
forwards `/api` requests to the Node API through the host Docker bridge at
`172.17.0.1:4174`. That bridge address is private to the VPS.

## Runtime prerequisite

Install Node.js `22.12.0` or newer, matching the version required by
`package.json`, and ensure `npm` is available to the service account.

The production entrypoint is `npm run start`, which runs
`scripts/production-server.mjs`. It binds the Node service to
`${HOST:-127.0.0.1}:${PORT:-4174}` and discovers the handlers under `api/`. On
this VPS, set `HOST=172.17.0.1` so the Caddy container can reach the service;
the address is still private to the Docker bridge. The checked-in adapter:

- listens on the configured `HOST` and `PORT` and honors explicit values;
- dispatches every `api/**/*.js` handler at its matching `/api/...` path and
  exposes the URL query parameters as `req.query`;
- passes through authorization, cookie and signature headers, leaves the
  request stream available for each handler's body reader, and provides the
  response helpers used by the handlers (`status`, `json`, `send` and
  `redirect`); and
- leaves `/api/*` responses uncached while preserving exact request bytes for
  Stripe and Alipay signature callbacks and the protected QR upload.

Do not use `npm run preview` as the production command. It only serves static
files and does not dispatch the API handlers. A service that only serves
`dist` will make the gallery appear to work while login, generation, billing
and webhook routes fail.

## DNS and firewall

In the `zero2codex.dev` Cloudflare zone, create or update only this record:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `gpt-image` | `178.105.194.250` | Auto |
| A | `gpt-image2` | `178.105.194.250` | Auto |

Leave the apex record and any records used by the existing root site as they
are. Caddy needs public TCP ports 80 and 443 for HTTP to HTTPS redirection and
certificate issuance. Keep 4174 bound only to the private Docker bridge and do
not expose it in the firewall.

For a Debian or Ubuntu VPS, verify the public rules with the host's existing
firewall policy and add only the web ports if they are missing:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## 在 VPS 上從 GitHub 取用並建置

建立專用服務帳號和獨立資料夾。以下指令不會碰 `/var/www/zero2codex`：

```bash
if ! getent passwd gpt-image2 >/dev/null; then
  sudo useradd --system --home-dir /var/www/gpt-image2 --shell /usr/sbin/nologin gpt-image2
fi
sudo install -d -o gpt-image2 -g gpt-image2 -m 0755 /var/www/gpt-image2
```

第一次部署由 VPS 直接從 GitHub 取用這個儲存庫，不需要從本機上傳檔案。
如果儲存庫已經存在，就使用 `git pull --ff-only` 更新；接著以服務帳號
安裝鎖定的相依套件：

```bash
if [ -d /var/www/gpt-image2/.git ]; then
  sudo -u gpt-image2 git -C /var/www/gpt-image2 pull --ff-only
else
  sudo -u gpt-image2 git clone \
    https://github.com/irons163/awesome-gpt-image-2-zh.git \
    /var/www/gpt-image2
fi
cd /var/www/gpt-image2
sudo -u gpt-image2 npm ci
```

The `VITE_*` values are embedded into `dist` at build time. Export only the
public browser values needed by this deployment, then build:

```bash
export VITE_SUPABASE_URL='<public Supabase URL>'
export VITE_SUPABASE_ANON_KEY='<public Supabase anon key>'
export VITE_DISCORD_URL='<public Discord invite URL>'
export VITE_GA_MEASUREMENT_ID='<GA4 measurement ID, if enabled>'
sudo -u gpt-image2 env \
  VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY" \
  VITE_DISCORD_URL="$VITE_DISCORD_URL" \
  VITE_GA_MEASUREMENT_ID="$VITE_GA_MEASUREMENT_ID" \
  npm run build
unset VITE_SUPABASE_URL VITE_SUPABASE_ANON_KEY VITE_DISCORD_URL VITE_GA_MEASUREMENT_ID
```

Do not put service-role, Stripe, Alipay, image API or OAuth secrets in a
`VITE_*` variable: Vite copies `VITE_*` values into browser JavaScript.

The Caddy container reads the bind-mounted build as root. The `0755` site
directory and normal build output are therefore sufficient for static serving;
the runtime environment file below remains readable only by root.

## Runtime environment

Create a root-owned environment file and copy only the variables required by
the enabled features from [`.env.example`](../../.env.example). Keep the file
out of Git and do not place its contents in this guide:

```bash
sudo install -d -o root -g gpt-image2 -m 0750 /etc/gpt-image2
sudo touch /etc/gpt-image2/gpt-image2.env
sudo chown root:root /etc/gpt-image2/gpt-image2.env
sudo chmod 0600 /etc/gpt-image2/gpt-image2.env
sudoedit /etc/gpt-image2/gpt-image2.env
```

At minimum, set the public application URL and the listener values in that
file. Add the server-side Supabase, image API, Stripe, Alipay, Watcha and GA4
variables only when those features are enabled:

```dotenv
APP_URL=https://gpt-image.zero2codex.dev
HOST=172.17.0.1
PORT=4174
NODE_ENV=production
```

The systemd manager reads this file before starting Node and passes the values
to the service. The application account does not need direct read access.
Keep payment private keys and service-role keys out of the repository, `dist`
and the Caddy configuration.

## systemd service

Create `/etc/systemd/system/gpt-image2.service` without changing any unit for
the existing root site:

```ini
[Unit]
Description=GPT-Image2 Node API
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=gpt-image2
Group=gpt-image2
WorkingDirectory=/var/www/gpt-image2
EnvironmentFile=/etc/gpt-image2/gpt-image2.env
Environment=NODE_ENV=production
Environment=HOST=172.17.0.1
Environment=PORT=4174
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
ProtectHome=true
ProtectSystem=full
ReadWritePaths=/var/www/gpt-image2

[Install]
WantedBy=multi-user.target
```

Use the absolute path returned by `command -v npm` if npm is installed outside
`/usr/bin`. The current adapter reads `HOST` and `PORT`; `172.17.0.1` is the
private host-side Docker bridge used by the Caddy container. Do not bind the
service to a public interface, and adjust only `ExecStart` if the Node
entrypoint is changed later.

Start it after the build and environment file are ready:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now gpt-image2.service
sudo systemctl status gpt-image2.service
curl --fail http://172.17.0.1:4174/api/community/config
```

If the local API check fails, inspect the service before changing Caddy:

```bash
sudo journalctl -u gpt-image2.service -n 100 --no-pager
```

## Caddy and HTTPS

The VPS Caddy instance is managed by Docker Compose from `/opt/caddy`. Keep
its existing site blocks in place and add the block from
[`Caddyfile`](Caddyfile) to `/opt/caddy/Caddyfile`; do not replace the file.
Back up the Compose files before editing them:

```bash
sudo cp /opt/caddy/Caddyfile /opt/caddy/Caddyfile.before-gpt-image2-YYYYMMDD
sudo cp /opt/caddy/compose.yaml /opt/caddy/compose.yaml.before-gpt-image2-YYYYMMDD
```

Add this read-only bind mount under the `caddy` service's `volumes` in
`/opt/caddy/compose.yaml`:

```yaml
- /var/www/gpt-image2/dist:/srv/gpt-image2:ro
```

The checked-in block already uses `/srv/gpt-image2` for static files and
`172.17.0.1:4174` for the API, matching this Compose setup. Validate the
complete configuration and recreate only the Caddy container:

```bash
sudo docker compose -f /opt/caddy/compose.yaml config
sudo docker exec caddy-caddy-1 caddy validate \
  --config /etc/caddy/Caddyfile --adapter caddyfile
sudo docker compose -f /opt/caddy/compose.yaml up -d caddy
```

The site blocks obtain and renew certificates for both hostnames
automatically. The old hostname redirects to the new canonical hostname.
Once DNS resolves and ports 80/443 reach the VPS, verify the public routes:

```bash
curl --fail --head https://gpt-image.zero2codex.dev/
curl --fail --head https://gpt-image.zero2codex.dev/community
curl --fail --head https://gpt-image.zero2codex.dev/community/result
curl --fail --include https://gpt-image.zero2codex.dev/api/community/config
curl --fail --head --location https://gpt-image2.zero2codex.dev/
```

The two community URLs must return the SPA entry point through the Caddy
fallback. The API response should contain `Cache-Control: no-store` and must
come from the Node service. Caddy limits API request bodies to 8 MB, which is
above the application's 2 MiB QR upload limit while still bounding accidental
large requests.

## External callbacks

After HTTPS works, update external providers to use the public hostname:

- add `https://gpt-image.zero2codex.dev` to the Supabase Auth redirect URLs;
- set the Stripe webhook endpoint to
  `https://gpt-image.zero2codex.dev/api/billing/webhook` when Stripe is
  enabled; and
- set the Alipay notification endpoint to
  `https://gpt-image.zero2codex.dev/api/billing/alipay/notify` (and the
  community endpoint when enabled).

Keep webhook routes on the `/api/` path so Caddy applies the raw request
forwarding, body limit and no-cache policy.

## Updating the site

Run updates from the application directory as `gpt-image2`, rebuild the Vite
assets, and restart only this unit. Re-export the same public `VITE_*` build
values before `npm run build` (or keep them in an untracked
`.env.production.local`); the systemd runtime environment is not used when
building browser assets.

```bash
cd /var/www/gpt-image2
sudo -u gpt-image2 git pull --ff-only
sudo -u gpt-image2 npm ci
sudo -u gpt-image2 npm run build
sudo systemctl restart gpt-image2.service
```

The Caddy site and the existing `/var/www/zero2codex` site do not need to be
stopped or rewritten for an application update.
