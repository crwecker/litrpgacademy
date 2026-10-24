import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const domine = localFont({ src: '../fonts/Domine-VariableFont_wght.ttf', variable: '--font-domine' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'LitRPG Academy: find your next LitRPG read',
    template: '%s | LitRPG Academy',
  },
  description:
    'Discover, rank, and share LitRPG, progression fantasy, cultivation, and isekai books. Tier lists and reviews from readers who love the genre.',
  openGraph: {
    siteName: 'LitRPG Academy',
    type: 'website',
    images: [{ url: '/images/banner-wide.png', width: 3840, height: 1200 }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className={`${inter.variable} ${domine.variable}`}>
      <body className='starfield min-h-screen font-sans antialiased'>
        <SiteHeader />
        <main className='mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6'>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
