import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "SHREEG Investment Portal - Preference Bond Shareholding",
  description: "Manage your preference bond investments with SHREEG Expert Wealth Advisory Limited. Track dividends, view portfolio, and access your investment agreements.",
  keywords: "investment, preference bonds, shareholding, dividends, wealth management, SHREEG",
  authors: [{ name: "SHREEG Expert Wealth Advisory Limited" }],
  openGraph: {
    title: "SHREEG Investment Portal",
    description: "Manage your preference bond investments and track your portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
