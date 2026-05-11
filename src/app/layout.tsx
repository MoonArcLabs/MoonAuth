import type { Metadata, Viewport } from 'next'
import { Sora, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/context/ToastContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { SecurityProvider } from '@/context/SecurityContext'
import { AccountsProvider } from '@/context/AccountsContext'
import { ToastContainer } from '@/components/common/Toast'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MoonAuth',
  description: 'Premium offline TOTP authenticator. Your codes, your device.',
  applicationName: 'MoonAuth',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MoonAuth',
  },
  openGraph: {
    title: 'MoonAuth',
    description: 'Premium offline TOTP authenticator.',
    images: [{ url: '/moonauth-og.png', width: 1200, height: 630 }],
  },
  icons: {
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MoonAuth" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link
          rel="apple-touch-startup-image"
          href="/splash/splash-750x1334.svg"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/splash-1170x2532.svg"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/splash-1284x2778.svg"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/splash-1290x2796.svg"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/splash-2048x2732.svg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"
        />
      </head>
      <body className="bg-black text-[#f0f0f0] font-inter antialiased">
        <ToastProvider>
          <SettingsProvider>
            <SecurityProvider>
              <AccountsProvider>
                {children}
                <ToastContainer />
              </AccountsProvider>
            </SecurityProvider>
          </SettingsProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
