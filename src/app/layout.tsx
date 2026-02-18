import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tradergwealth.com'),
  title: {
    default: "TraderG Wealth Investment Portal - Preference Bond Shareholding",
    template: "%s | TraderG Wealth"
  },
  description: "Securely manage your preference bond investments with TRADERG WEALTH ADVISORY LIMITED. Track dividends, view real-time portfolio data, and access investment agreements.",
  keywords: ["investment", "preference bonds", "shareholding", "dividends", "wealth management", "TraderG Wealth", "unlisted equity", "asset management"],
  authors: [{ name: "TRADERG WEALTH ADVISORY LIMITED" }],
  creator: "TRADERG WEALTH ADVISORY LIMITED",
  publisher: "TRADERG WEALTH ADVISORY LIMITED",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TraderG Wealth Investment Portal",
    description: "Securely manage your preference bond investments and track your portfolio with TraderG Wealth.",
    url: 'https://tradergwealth.com',
    siteName: 'TraderG Wealth',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'TraderG Wealth Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TraderG Wealth Investment Portal',
    description: 'Securely manage your preference bond investments and track your portfolio.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
