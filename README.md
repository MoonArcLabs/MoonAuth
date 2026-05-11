# MoonAuth

Offline TOTP authenticator. Scan a QR, get your codes. Nothing leaves your device.

## What it does

- Generates 2FA codes (TOTP / RFC 6238) for any service — Discord, GitHub, whatever
- Stores everything encrypted on-device with AES-256-GCM
- Works offline, installs as a PWA
- PIN lock with auto-lock timer
- Encrypted backup/restore via `.moonauth` files

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Push to `main` → GitHub Actions builds and deploys to GitHub Pages automatically.

Set `NEXT_PUBLIC_BASE_PATH=/MoonAuth` in the workflow if your repo is named `MoonAuth`.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind · Framer Motion · idb · jsQR

## License

MIT
