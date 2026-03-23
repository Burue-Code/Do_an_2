import type { ReactNode } from 'react';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { QueryProvider } from '@/providers/query-provider';
import { FavoriteGenreOnboarding } from '@/components/auth/favorite-genre-onboarding';
import { AuthProvider } from '@/providers/auth-provider';

export const metadata = {
  title: 'Movie Recommendation System',
  description: 'Frontend for movie recommendation system by genre'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="app-root">
        <QueryProvider>
          <AuthProvider>
            <FavoriteGenreOnboarding />
            <Header />
            <main className="app-main">{children}</main>
            <Footer />
            <ScrollToTop />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

