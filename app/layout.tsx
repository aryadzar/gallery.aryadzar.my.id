import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { QueryProvider } from '@/providers/query-provider'
import './globals.css'


export const metadata: Metadata = {
  title: {
    default: "Gallery Arya Dzaky",
    template: "%s | Gallery Arya Dzaky", // format untuk halaman lain
  },
  description: "Created by Arya Dzaky. Koleksi foto dan video dalam sebuah gallery interaktif.",
  applicationName: "Gallery Arya Dzaky",
  authors: [{ name: "Arya Dzaky" }],
  generator: "Next.js",
  keywords: ["gallery", "photo", "video", "arya dzaky", "portfolio"],
  referrer: "origin-when-cross-origin",
  creator: "Arya Dzaky",
  publisher: "Arya Dzaky",

  // icons
  icons: {
    icon: "/favicon.ico", // dari public/
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // opsional
  },

  // Open Graph (untuk SEO + preview di sosial media)
  openGraph: {
    title: "Gallery Arya Dzaky",
    description: "Koleksi foto dan video interaktif karya Arya Dzaky.",
    url: "https://aryadzar.my.id", // ganti dengan domain asli
    siteName: "Gallery Arya Dzaky",
    images: [
      {
        url: "/og-image.png", // taruh di public/
        width: 1200,
        height: 630,
        alt: "Gallery Arya Dzaky",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Gallery Arya Dzaky",
    description: "Koleksi foto dan video interaktif karya Arya Dzaky.",
    creator: "@your_twitter", // ganti jika punya
    images: ["/og-image.png"],
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  )
}
