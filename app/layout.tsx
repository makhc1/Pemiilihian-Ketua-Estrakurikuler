import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'Pemilihan Ketua ICT | SMKN 20 Jakarta',
    template: '%s | ICT SMKN 20 Jakarta'
  },
  description: 'Sistem E-Voting resmi untuk Pemilihan Ketua Ekstrakurikuler Information Communication Technology (ICT) SMKN 20 Jakarta. Aman, transparan, dan real-time.',
  keywords: ['E-Voting', 'Pemilihan Ketua', 'ICT SMKN 20', 'Ekstrakurikuler IT', 'SMKN 20 Jakarta', 'Osis SMKN 20', 'Voting Online'],
  authors: [{ name: 'ICT SMKN 20 Jakarta' }],
  creator: 'Tim IT ICT SMKN 20',
  publisher: 'SMKN 20 Jakarta',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://pemiilihian-ketua-estrakurikuler.vercel.app', // placeholder, user can update
    title: 'Pemilihan Ketua ICT | SMKN 20 Jakarta',
    description: 'Sistem E-Voting resmi untuk Pemilihan Ketua Ekstrakurikuler ICT SMKN 20 Jakarta.',
    siteName: 'ICT SMKN 20',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Open Graph Banner - Pemilihan Ketua ICT SMKN 20 Jakarta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pemilihan Ketua ICT | SMKN 20 Jakarta',
    description: 'Sistem E-Voting resmi untuk Pemilihan Ketua Ekstrakurikuler ICT SMKN 20 Jakarta.',
    images: ['/og-image.jpg'],
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
  icons: {
    icon: '/inilogo.jpg',
    shortcut: '/inilogo.jpg',
    apple: '/inilogo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} font-sans`}>
      <body className="antialiased bg-[var(--color-background)] text-[var(--color-foreground)] selection:bg-black selection:text-white">
        {children}
        <div className="noise-overlay"></div>
      </body>
    </html>
  );
}
