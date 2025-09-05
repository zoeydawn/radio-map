import type { Metadata, Viewport } from 'next'
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Radio Map', // Customize your app title for iOS
  },
}

export const viewport: Viewport = {
  themeColor: '#ffffff', // Customize your theme color
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
