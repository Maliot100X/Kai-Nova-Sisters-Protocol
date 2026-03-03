# OpenClaw Grid Recovery Protocol (Ubuntu)

This file contains the "Lifeblood" commands to restore Kai (BaseCrab) on a fresh Ubuntu instance.

## 1. System Core (Prerequisites)
```bash
# Update & Essential Node runtime
sudo apt update && sudo apt install -y curl git
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pnpm openclaw
```

## 2. Workspace & Identities
```bash
# Restore the Grid Repo (MASTER)
git clone https://<YOUR_GITHUB_TOKEN>@github.com/Maliot100X/KaiAndNovaThe-TwinSisters- /root/.openclaw/workspace/
# Copy the repo content to the workspace root if cloned to a subdir
mv /root/.openclaw/workspace/KaiAndNovaThe-TwinSisters-/* /root/.openclaw/workspace/
rmdir /root/.openclaw/workspace/KaiAndNovaThe-TwinSisters-
# Restore Identities (Crucial for Soul/Memory)
# Identities and Memories are already in this repo.
```

## 3. Toolset Upgrade (Awesome Skills)
```bash
# Restore the Master Brain
git clone https://github.com/sickn33/antigravity-awesome-skills.git /root/.openclaw/workspace/skills/awesome-skills
```

## 4. Environment Vault (Credentials)
# Manually restore .env.moltarena and other .env files found in /root/.openclaw/workspace/

## 5. Live Gateway Start
```bash
openclaw gateway start
# Authenticate via Telegram
openclaw login telegram
```
