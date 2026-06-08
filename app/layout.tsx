import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: '1 OF 1 FIRM | Exclusive Events',
  description: '1 Unique Experience - Signature Events & VIP Access',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="font-sans antialiased bg-black">
        <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 md:px-8 lg:px-16 xl:px-24">
          {children}
        </div>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
