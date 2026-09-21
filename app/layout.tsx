import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Cash for Houses Summit | Direct Home Buyer & Available Properties",
  description:
    "Cash for Houses Summit buys residential properties directly from homeowners nationwide. Get a transparent cash offer within 48 hours with zero listing fees. Browse available homes for sale.",
  keywords: [
    "cash for houses",
    "sell house fast",
    "home buyers nationwide",
    "no listing fee home sale",
    "as is house buyer",
    "cash offer home",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-brand-dark bg-[#FAFAFA] text-lg leading-relaxed selection:bg-brand-orange selection:text-white">
        {children}
      </body>
    </html>
  );
}
