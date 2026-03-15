import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>MOVIE RECOMMENDATION</span>
          <p className={styles.tagline}>Đồ án hệ thống gợi ý phim theo thể loại</p>
        </div>
        <nav className={styles.links}>
          <Link href="/about" className={styles.link}>
            Giới thiệu
          </Link>
          <Link href="/contact" className={styles.link}>
            Liên hệ
          </Link>
          <Link href="/terms" className={styles.link}>
            Điều khoản
          </Link>
          <Link href="/privacy" className={styles.link}>
            Chính sách bảo mật
          </Link>
          <Link href="/faq" className={styles.link}>
            FAQ
          </Link>
        </nav>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Movie Recommendation System
        </p>
      </div>
    </footer>
  );
}
