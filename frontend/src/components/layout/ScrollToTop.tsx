'use client';

import { useState, useEffect } from 'react';
import styles from './ScrollToTop.module.css';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={scrollToTop}
      aria-label="Về đầu trang"
    >
      ↑
    </button>
  );
}
