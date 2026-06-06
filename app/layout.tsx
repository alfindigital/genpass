import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'GenPass - Pembuat Password Aman & Acak Gratis',
  description: 'Buat password yang kuat dan aman secara instan. Generator password gratis, berjalan lokal, tanpa penyimpanan data. Dengan kontrol penuh atas karakter dan panjang password.',
  keywords: 'password generator, pembuat password, generator password aman, password random, tool password gratis, password manager',
  authors: [{ name: 'GenPass', url: 'https://genpass.vercel.app' }],
  creator: 'GenPass',
  publisher: 'GenPass',
  metadataBase: new URL('https://genpass.vercel.app'),
  alternates: {
    canonical: 'https://genpass.vercel.app',
  },
  openGraph: {
    type: 'website',
    url: 'https://genpass.vercel.app',
    title: 'GenPass - Pembuat Password Aman & Acak Gratis',
    description: 'Buat password yang kuat dan aman secara instan. Generator password gratis, berjalan lokal, tanpa penyimpanan data.',
    siteName: 'GenPass',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GenPass - Password Generator',
        type: 'image/png',
      },
    ],
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GenPass - Pembuat Password Aman & Acak Gratis',
    description: 'Buat password yang kuat dan aman secara instan.',
    images: ['/og-image.png'],
    creator: '@alfindigital',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  generator: 'v0.app',
  applicationName: 'GenPass',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GenPass',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
    apple: '/apple-icon.png',
    other: [
      {
        rel: 'icon',
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0e27" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GenPass" />
        <meta name="msapplication-TileColor" content="#0066cc" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="alternate" hrefLang="id" href="https://genpass.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'GenPass - Pembuat Password Aman',
              description: 'Buat password yang kuat dan aman secara instan. Generator password gratis, berjalan lokal, tanpa penyimpanan data.',
              url: 'https://genpass.vercel.app',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Web',
              image: 'https://genpass.vercel.app/og-image.png',
              creator: {
                '@type': 'Person',
                name: 'Alfin Digital',
                url: 'https://github.com',
              },
              potentialAction: {
                '@type': 'Action',
                target: 'https://genpass.vercel.app',
                'http-method': 'GET',
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'IDR',
              },
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} font-poppins antialiased`}>
        {children}
        <Toaster position="bottom-right" theme="light" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
