# Own server — one-time setup

How it runs: **Nginx (HTTPS) → pm2 → Next.js standalone bundle** on `127.0.0.1:3000`.
GitHub Actions builds the bundle, copies it over SSH and switches it in. The server never runs `npm install` or a build.
If the new release fails its health check, the deploy script switches back to the previous one on its own.

Assumes Ubuntu/Debian on **x64** (on an ARM server, tell Claude: the image library must be built for ARM).
Commands use `deploy` as the SSH user that GitHub Actions logs in as (`DEPLOY_USER`).

## 1. Node 22+ and pm2
> Our server already has Node 24 + pm2 through **nvm** (user `madhan`); `remote-deploy.sh` loads nvm itself. Only `pm2 startup` is needed there. The steps below are for a fresh server.

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx
sudo npm i -g pm2
pm2 startup systemd -u deploy --hp /home/deploy   # run the command it prints, so the site starts after a reboot
```
Check: `node -v` → v22 or newer (Next.js 16 needs ≥ 20.9; `--env-file` needs ≥ 20.6).

## 2. App folder and settings
```bash
sudo mkdir -p /var/www/deepcleanz/{releases,shared/media,shared/logs}
sudo chown -R deploy:deploy /var/www/deepcleanz
nano /var/www/deepcleanz/shared/.env && chmod 600 /var/www/deepcleanz/shared/.env
```
`shared/.env`:
```
DATABASE_URL=mongodb+srv://...            # Atlas production database
PAYLOAD_SECRET=...                        # openssl rand -hex 32 — new, not your dev one
NEXT_PUBLIC_SERVER_URL=https://deepcleanz.com
# optional email alerts
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=bookings@deepcleanz.com
ALERT_EMAIL=
```
- Leave `BLOB_READ_WRITE_TOKEN` out: images go to `shared/media`, which survives deploys. **Back up that folder** (it plus Atlas is everything).
- Atlas → Network Access: add the server's public IP.

## 3. Nginx + HTTPS
```bash
sudo cp deploy/nginx/deepcleanz.conf /etc/nginx/sites-available/deepcleanz.conf
sudo ln -s /etc/nginx/sites-available/deepcleanz.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default        # and disable the old static-site config for deepcleanz.com
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d deepcleanz.com -d www.deepcleanz.com
sudo nginx -t && sudo systemctl reload nginx
```
- The old site's Nginx block (serving the static `build/` folder) must be removed or disabled, or it will keep answering for deepcleanz.com.
- If the old API still runs on this server, uncomment the `/api/v1/` block and set its port.
- Firewall: open 80 and 443 only; port 3000 stays local.

## 4. GitHub
Repo → Settings → Secrets and variables → Actions:
- Secrets already exist from the old deploy: `DEPLOY_SSH_PRIVATE_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PORT`. (`DEPLOY_PATH` is no longer used.)
- Variable (optional): `APP_DIR` if not `/var/www/deepcleanz`.

Deploys run on every push to `main` (and by hand: Actions → CI and CD → Run workflow on `main`).
Merging `revamp/nextjs-payload` into `main` is what switches the live site over — do that on launch day.

## 5. First data
Run the seed from your laptop against the **production** database once (set `DATABASE_URL` to the Atlas production URI in your local `.env`, `npm run seed`, then switch it back), then enter prices and content in `https://deepcleanz.com/admin`.

## Day-to-day
| Task | Command (on the server) |
|---|---|
| Status / memory | `pm2 status` |
| Live logs | `pm2 logs deepcleanz` |
| Restart | `pm2 restart deepcleanz` |
| Changed `shared/.env` | `cd /var/www/deepcleanz/current && APP_DIR=/var/www/deepcleanz pm2 startOrReload deploy/ecosystem.config.cjs --update-env` |
| Roll back by hand | `ls /var/www/deepcleanz/releases` → `ln -sfn /var/www/deepcleanz/releases/<older> /var/www/deepcleanz/current && pm2 restart deepcleanz` |

Each deploy restarts the app (about 2–5 seconds of downtime). Deploy outside booking peaks.
