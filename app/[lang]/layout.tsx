import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Settings } from "@/lib/meta"
import { Footer } from "@/components/navigation/footer"
import { Navbar } from "@/components/navigation/navbar"
import { Providers } from "@/components/providers"

import "@/styles/globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const baseUrl = Settings.metadataBase

export const metadata: Metadata = {
  title: Settings.title,
  metadataBase: new URL(baseUrl),
  description: Settings.description,
  keywords: Settings.keywords,
  openGraph: {
    type: Settings.openGraph.type,
    url: baseUrl,
    title: Settings.openGraph.title,
    description: Settings.openGraph.description,
    siteName: Settings.openGraph.siteName,
    images: Settings.openGraph.images.map((image) => ({
      ...image,
      url: `${baseUrl}${image.url}`,
    })),
  },
  twitter: {
    card: Settings.twitter.card,
    title: Settings.twitter.title,
    description: Settings.twitter.description,
    site: Settings.twitter.site,
    images: Settings.twitter.images.map((image) => ({
      ...image,
      url: `${baseUrl}${image.url}`,
    })),
  },
  alternates: {
    canonical: baseUrl,
  },
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params

  return (
    <html lang={lang} suppressHydrationWarning>
      {/* {Settings.gtmconnected && <GoogleTagManager gtmId={Settings.gtm} />} */}
      <body className={`${inter.variable} font-regular`}>
        <Providers>
          <Navbar />
          <main className="h-auto">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
