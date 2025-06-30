import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { SupabaseProvider } from '@/components/SupabaseProvider';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VedicConnect - Bridging Ancient Wisdom with Modern Learning',
  description: 'A comprehensive platform for Vedic education, connecting students and instructors through interactive learning experiences.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
          </ThemeProvider>
        </SupabaseProvider>
        <Toaster />
      </body>
    </html>
  );
}