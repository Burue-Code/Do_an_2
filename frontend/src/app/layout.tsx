import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Movie Recommendation System',
  description: 'Frontend for movie recommendation system by genre'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

