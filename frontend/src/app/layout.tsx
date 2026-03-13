import type { ReactNode } from 'react';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Movie Recommendation System',
  description: 'Frontend for movie recommendation system by genre'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="app-root">
        <Header />
        <main className="app-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

