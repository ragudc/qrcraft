import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/shared/ThemeProvider"
import { Header } from "@/components/shared/Header"
import { Footer } from "@/components/shared/Footer"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default:  'QRCraft — Free QR Code Generator',
    template: '%s | QRCraft',
  },
  description:
    'Create beautiful, custom QR codes in seconds. ' +
    'Customize colors, styles, add your logo and download ' +
    'in PNG, SVG or PDF. Free, no sign-up required.',
  keywords: [
    'QR code generator',
    'free QR code',
    'custom QR code',
    'QR code with logo',
    'QR code maker',
    'QR code download',
  ],
  authors:  [{ name: 'QRCraft' }],
  creator:  'QRCraft',
  metadataBase: new URL('https://qrcraft-mocha.vercel.app'),
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://qrcraft-mocha.vercel.app',
    title:       'QRCraft — Free QR Code Generator',
    description: 'Create beautiful, custom QR codes in seconds. ' +
                 'Free, no sign-up required.',
    siteName:    'QRCraft',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'QRCraft — Free QR Code Generator',
    description: 'Create beautiful, custom QR codes in seconds. ' +
                 'Free, no sign-up required.',
  },
  icons: {
    icon:  '/favicon.svg',
    apple: '/favicon.svg',
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
