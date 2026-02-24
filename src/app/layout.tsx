import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://onestoputilities.com.au'),
  title: {
    default: "One Stop Utilities - Premium Solar, Battery & Managed IT Services",
    template: "%s | One Stop Utilities"
  },
  description: "One Stop Utilities provides premium end-to-end solutions for Solar PV, Battery Storage, Energy-Efficient Climate Control, and Managed IT Services across Australia.",
  keywords: ["solar", "battery storage", "air conditioning", "managed IT", "energy efficiency", "One Stop Utilities", "sustainable energy", "utility services"],
  authors: [{ name: "One Stop Utilities" }],
  creator: "One Stop Utilities",
  publisher: "One Stop Utilities",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "One Stop Utilities - Sustainable Utility Solutions",
    description: "Expert engineering for Solar, Battery, Climate Control, and Managed IT. Powering properties across Australia with precision.",
    url: 'https://onestoputilities.com.au',
    siteName: 'One Stop Utilities',
    images: [
      {
        url: '/onestop-logo.png',
        width: 800,
        height: 600,
        alt: 'One Stop Utilities Logo',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One Stop Utilities - Premium Utility Services',
    description: 'Expert engineering for Solar, Battery, Climate Control, and Managed IT. Sustainable solutions for modern properties.',
    images: ['/onestop-logo.png'],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "One Stop Utilities",
              "url": "https://onestoputilities.com.au",
              "logo": "https://onestoputilities.com.au/onestop-logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "connect@onestoputilities.com.au",
                "telephone": "1300178678",
                "contactType": "customer service"
              },
              "description": "One Stop Utilities provides premium end-to-end solutions for Solar PV, Battery Storage, Energy-Efficient Climate Control, and Managed IT Services.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "1/13-15 Penelope Cres",
                "addressLocality": "Arndell Park",
                "addressRegion": "NSW",
                "postalCode": "2148",
                "addressCountry": "AU"
              }
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
