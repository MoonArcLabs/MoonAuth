#!/usr/bin/env node

const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const publicDir = path.join(__dirname, '..', 'public')
const iconsDir = path.join(publicDir, 'icons')
const splashDir = path.join(publicDir, 'splash')

fs.mkdirSync(iconsDir, { recursive: true })
fs.mkdirSync(splashDir, { recursive: true })

const moonSVG = (size, padding = 0) => {
  const center = size / 2
  const moonR = (size - padding * 2) * 0.26
  const moonX = center - moonR * 0.35
  const cutR = moonR * 0.85
  const cutX = center + moonR * 0.37

  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <g transform="rotate(15 ${center} ${center})">
    <circle cx="${moonX}" cy="${center}" r="${moonR}" fill="white"/>
    <circle cx="${cutX}" cy="${center}" r="${cutR}" fill="#000000"/>
  </g>
</svg>`)
}

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512]

async function generateIcons() {
  console.log('Generating PWA icons...')

  for (const size of iconSizes) {
    const svg = moonSVG(size)
    const outPath = path.join(iconsDir, `icon-${size}x${size}.png`)
    await sharp(svg).resize(size, size).png().toFile(outPath)
    console.log(`  icon-${size}x${size}.png`)
  }

  // Maskable icon (safe zone: 80% center)
  const maskableSVG = moonSVG(512, 51) // ~10% padding each side
  await sharp(maskableSVG).resize(512, 512).png().toFile(path.join(iconsDir, 'maskable-icon-512x512.png'))
  console.log('  maskable-icon-512x512.png')

  // Apple touch icon
  await sharp(moonSVG(180)).resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'))
  console.log('  apple-touch-icon.png')

  // Favicons
  await sharp(moonSVG(16)).resize(16, 16).png().toFile(path.join(iconsDir, 'favicon-16x16.png'))
  await sharp(moonSVG(32)).resize(32, 32).png().toFile(path.join(iconsDir, 'favicon-32x32.png'))
  console.log('  favicon-16x16.png')
  console.log(' favicon-32x32.png')

  // OG image
  const ogSVG = fs.readFileSync(path.join(publicDir, 'moonauth-og.svg'))
  await sharp(ogSVG).resize(1200, 630).png().toFile(path.join(publicDir, 'moonauth-og.png'))
  console.log('  moonauth-og.png')

  // iOS splash screens
  const splashSizes = [
    { w: 750, h: 1334, name: 'splash-750x1334.png' },
    { w: 1170, h: 2532, name: 'splash-1170x2532.png' },
    { w: 1284, h: 2778, name: 'splash-1284x2778.png' },
    { w: 1290, h: 2796, name: 'splash-1290x2796.png' },
    { w: 2048, h: 2732, name: 'splash-2048x2732.png' },
  ]

  for (const { w, h, name } of splashSizes) {
    const moonSize = Math.round(w * 0.27)
    const mR = moonSize * 0.26
    const mX = w / 2 - mR * 0.35
    const cR = mR * 0.85
    const cX = w / 2 + mR * 0.37
    const cy = h / 2 - moonSize * 0.12

    const splashSVG = Buffer.from(`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="#000000"/>
  <g transform="rotate(15 ${w / 2} ${cy})">
    <circle cx="${mX}" cy="${cy}" r="${mR}" fill="white"/>
    <circle cx="${cX}" cy="${cy}" r="${cR}" fill="#000000"/>
  </g>
  <text x="${w / 2}" y="${cy + moonSize * 0.7}" text-anchor="middle" font-family="sans-serif" font-weight="700" font-size="${Math.round(w * 0.043)}" fill="white" letter-spacing="${Math.round(w * 0.006)}">MoonAuth</text>
  <text x="${w / 2}" y="${cy + moonSize * 0.7 + Math.round(w * 0.055)}" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(w * 0.019)}" fill="#888">Your codes. Your device. Your secrets.</text>
</svg>`)

    await sharp(splashSVG).resize(w, h).png().toFile(path.join(splashDir, name))
    console.log(`  ${name}`)
  }

  // favicon.ico note
  console.log('\n  Note: favicon.ico must be generated separately.')
  console.log('  Use: npx @squoosh/cli --oxipng auto public/icons/favicon-32x32.png -d public/')
  console.log('  Or use https://favicon.io to convert favicon-32x32.png to favicon.ico\n')

  console.log('Done! All icons generated.')
}

generateIcons().catch(console.error)
