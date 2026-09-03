import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <ul className={styles.links}>
            <li className={styles.linkItem}>
              <Link href="/terms">이용약관</Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/privacy">개인정보처리방침</Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/rules">커뮤니티 운영원칙</Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/contact">문의/신고</Link>
            </li>
          </ul>

          <div className={styles.statusText}>
            ● Backend: Spring Boot Ready
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © 2026 COCA Community. All rights reserved.
          </p>
          <p className={styles.disclaimer}>
            본 사이트는 개인 포트폴리오 목적으로 제작된 아카라이브 스타일 커뮤니티입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}