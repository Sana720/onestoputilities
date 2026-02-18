import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "TraderG Wealth Investment Portal - Preference Bond Shareholding",
  description: "Manage your preference bond investments with TRADERG WEALTH ADVISORY LIMITED. Track dividends, view portfolio, and access your investment agreements.",
  keywords: "investment, preference bonds, shareholding, dividends, wealth management, TraderG Wealth",
  authors: [{ name: "TRADERG WEALTH ADVISORY LIMITED" }],
  openGraph: {
    title: "TraderG Wealth Investment Portal",
    description: "Manage your preference bond investments and track your portfolio",
    type: "website",
  },
  icons: {
    icon: '/icon.png',
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
