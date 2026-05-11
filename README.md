# MoonAuth

[![PWA](https://img.shields.io/badge/PWA-ready-7c5cfc)](https://web.dev/progressive-web-apps/)
[![Offline](https://img.shields.io/badge/offline-first-22c55e)](https://web.dev/offline/)
[![No tracking](https://img.shields.io/badge/tracking-none-000)](https://moonarclabs.github.io/MoonAuth) 


> **Premium offline TOTP authenticator. Your codes, your device.**

<!-- Add a screenshot here: public/screenshot.png -->

---

## Features

- **100% Offline** — No server, no network requests, no data leaving your device
- **RFC 6238 TOTP** — Native WebCrypto HMAC-SHA1/256/512 implementation
- **AES-256-GCM Encryption** — All secrets encrypted at rest with PBKDF2-derived keys
- **QR Code Scanner** — Camera-based QR scanning with jsQR
- **PIN Lock** — 4–8 digit PIN with exponential backoff on wrong attempts
- **Auto-lock** — Configurable inactivity timeout (1/2/5/10/30 min or never)
- **Encrypted Backups** — Export/import `.moonauth` files with a backup password
- **PWA Install** — Install to home screen on iOS and Android
- **No tracking** — Zero analytics, zero telemetry, zero external requests
- **Dark theme** — Pure black UI with purple/blue glow accents

## Security Model

| Layer | Technology |
|-------|-----------|
| Encryption | AES-256-GCM (WebCrypto) |
| Key derivation | PBKDF2-HMAC-SHA256, 600,000 iterations |
| Storage | IndexedDB (encrypted blobs) |
| TOTP | WebCrypto HMAC-SHA1/256/512 |
| Transport | None — fully offline |

Secrets are **never** stored in plaintext. They exist in JavaScript memory only while the app is unlocked. On lock, the decryption key is cleared from memory.

## Local Development

```bash
git clone https://github.com/YOUR_USERNAME/moonauth
cd moonauth
npm install
node scripts/generate-icons.js   # generate PWA icons
npm run dev
# Open http://localhost:3000
```

## Production Build

```bash
npm run build
# Static files output to ./out/
npx serve out    # Preview locally
```

## GitHub Pages Deployment

1. Fork this repository
2. Go to **Settings → Pages → Source: GitHub Actions**
3. Push to `main` — the workflow builds and deploys automatically
4. App is live at `https://YOUR_USERNAME.github.io/moonauth/`

## Icon Generation

Icons are generated from SVG source using `sharp`:

```bash
node scripts/generate-icons.js
```

This produces all required PNG sizes in `public/icons/` and splash screens in `public/splash/`.

For `favicon.ico`, convert `public/icons/favicon-32x32.png` using [favicon.io](https://favicon.io) or Inkscape.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_PATH` | Base path for sub-directory deployments | `` (root) |

Set to `/moonauth` for GitHub Pages deployment in the `moonauth` repo.

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 15.x | Framework (static export) |
| React | 19.x | UI |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| Framer Motion | 11.x | Animations |
| idb | 8.x | IndexedDB wrapper |
| jsQR | 1.x | QR code decoding |
| next-pwa | 5.x | Service worker |
| zod | 3.x | Form validation |

## License

MIT © MoonAuth Contributors

---

## Privacy

**MoonAuth operates entirely offline. No data is collected, transmitted, or stored outside your device.**

The app uses:
- **IndexedDB** for encrypted account storage (local only)
- **localStorage** for preferences and device key salt (local only)
- **WebCrypto** for all cryptographic operations (browser built-in, no external calls)

There are no analytics libraries, no error reporting services, no CDN-loaded scripts, and no network requests of any kind at runtime.
