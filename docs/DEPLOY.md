# Deployment — Hetzner + Caddy

Static build → `rsync` to a Hetzner VPS → Caddy serves it over TLS. CI is in
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml); it runs on every
push to `main`. This checklist is what makes that workflow work — do it once.

## 1. Provision the box

- Hetzner Cloud **CX22** (2 vCPU / 4 GB) is plenty for a static site; **CX11/CPX11**
  also fine. Ubuntu 24.04 LTS.
- Create a non-root **deploy user** and give it ownership of the web root:
  ```bash
  sudo adduser --disabled-password deploy
  sudo mkdir -p /var/www/teatown
  sudo chown -R deploy:deploy /var/www/teatown
  ```
- Firewall: allow 22, 80, 443 only.
  ```bash
  sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw enable
  ```

## 2. Install Caddy

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

Copy [`deploy/Caddyfile`](../deploy/Caddyfile) to `/etc/caddy/Caddyfile`, adjust the
domain if needed, then `sudo systemctl reload caddy`. Caddy will fetch the TLS cert
automatically **once DNS points at the box** (step 4).

## 3. Deploy SSH key (CI → box)

Generate a dedicated keypair (do NOT reuse a personal key):

```bash
ssh-keygen -t ed25519 -f teatown_deploy -C "github-actions-deploy" -N ""
```

- Append `teatown_deploy.pub` to the box's `~deploy/.ssh/authorized_keys`.
- Capture the host key for `known_hosts` (pin it — avoids MITM on first connect):
  ```bash
  ssh-keyscan -p 22 <BOX_IP_OR_HOST>
  ```

## 4. DNS at GoDaddy

Point the domain at the box's IP:

| Type | Name | Value |
|------|------|-------|
| A    | @    | `<box IPv4>` |
| AAAA | @    | `<box IPv6>` (if enabled) |
| A    | www  | `<box IPv4>` |

Propagation is usually minutes. Caddy issues the cert on the first request after DNS resolves.

## 5. GitHub repo secrets

`Settings → Secrets and variables → Actions → New repository secret`:

| Secret | Value |
|--------|-------|
| `DEPLOY_SSH_KEY` | contents of the **private** `teatown_deploy` key |
| `DEPLOY_KNOWN_HOSTS` | output of the `ssh-keyscan` above |
| `DEPLOY_SSH_USER` | `deploy` |
| `DEPLOY_SSH_HOST` | box IP or hostname |
| `DEPLOY_PATH` | `/var/www/teatown` (must match the Caddyfile `root`) |
| `DEPLOY_SSH_PORT` | *(optional; defaults to 22)* |

## 6. First deploy

Push to `main` (or run the **Deploy** workflow manually via `workflow_dispatch`).
CI builds `dist/` and rsyncs it to `DEPLOY_PATH`. `--delete` keeps the web root an
exact mirror of the build, which is why `DEPLOY_PATH` must be a **dedicated**
directory — nothing else should live there.

## Rollback

Re-run the workflow from any previous green commit, or `git revert` and push. The
site is fully rebuilt from source each time — no server-side state to unwind.
