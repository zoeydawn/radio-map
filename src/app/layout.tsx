import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AppProvider } from '@/context/AppContext'
import StationModel from '@/components/StationModel'
import AudioPlayer from '@/components/AudioPlayer'
import PageWrapper from '@/components/PageWrapper'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Radio-Map',
  description: 'Listen to the world',
  // icons: {
  //   icon: [
  //     { url: '/favicon.ico', sizes: 'any' }, // For broadest browser compatibility (can contain multiple sizes)
  //     { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
  //     { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
  //     { url: '/icon.svg', type: 'image/svg+xml' }, // SVG for modern browsers
  //   ],
  //   apple: '/apple-touch-icon.png', // 180x180 for iOS home screens
  // },
  // manifest: '/site.webmanifest', // For PWAs (contains icons for Android)
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <Navbar />
          <PageWrapper>{children}</PageWrapper>
          <AudioPlayer />
          {/* <Footer /> */}
          <StationModel />
        </AppProvider>
      </body>
    </html>
  )
}
