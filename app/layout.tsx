import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Pemilihan Ketua ICT',
  description: 'Sistem Pemilihan Ketua Ekstrakurikuler ICT',
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
