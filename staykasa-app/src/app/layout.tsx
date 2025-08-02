import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConditionalNavbar } from "@/components/ui/conditional-navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StayKasa - Ghana's Premier Short-Let & Vacation Rental Platform | Book Direct",
  description: "Discover Ghana's finest vacation rentals and short-let accommodations in Accra, Kumasi & beyond. Book directly with local payment support (Mobile Money, Cards). Trusted by 1000+ guests. Instant booking, verified properties.",
  keywords: [
    "Short let Accra",
    "Vacation rental Ghana", 
    "Accra Airbnb",
    "Ghana holiday homes",
    "Accra serviced apartments",
    "Short stay accommodation Ghana",
    "Vacation homes Accra",
    "Ghana vacation rental platform",
    "Accra short term rental",
    "Ghana holiday accommodation",
    "StayKasa Ghana",
    "Ghana vacation rental Mobile Money",
    "Accra short let booking",
    "Ghana hospitality platform"
  ].join(", "),
  authors: [{ name: "StayKasa Team", url: "https://staykasa.com" }],
  creator: "StayKasa",
  publisher: "StayKasa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://staykasa.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "StayKasa - Ghana's Premier Short-Let & Vacation Rental Platform",
    description: "Book Ghana's finest vacation rentals directly. Support for Mobile Money, VISA, Mastercard. Verified properties in Accra, Kumasi & beyond. Instant booking, local expertise.",
    url: 'https://staykasa.com',
    siteName: 'StayKasa',
    images: [
      {
        url: '/Images/logo.webp',
        width: 1200,
        height: 630,
        alt: 'StayKasa - Ghana Vacation Rental Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StayKasa - Ghana Vacation Rental Platform',
    description: 'Book Ghana\'s finest vacation rentals directly with local payment support',
    images: ['/Images/logo.webp'],
    creator: '@staykasa',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'Travel & Tourism',
  classification: 'Vacation Rental Platform',
  other: {
    'geo.region': 'GH',
    'geo.placename': 'Accra, Ghana',
    'geo.position': '5.6145;-0.1869',
    'ICBM': '5.6145, -0.1869',
    'DC.title': 'StayKasa - Ghana Vacation Rental Platform',
    'DC.creator': 'StayKasa Team',
    'DC.subject': 'Vacation Rentals, Short-Let, Ghana, Accra',
    'DC.description': 'Ghana\'s premier vacation rental platform',
    'DC.publisher': 'StayKasa',
    'DC.contributor': 'StayKasa Team',
    'DC.date': '2024',
    'DC.type': 'Service',
    'DC.format': 'text/html',
    'DC.identifier': 'https://staykasa.com',
    'DC.language': 'en',
    'DC.coverage': 'Ghana',
    'DC.rights': 'Copyright 2024 StayKasa',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <ConditionalNavbar />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
