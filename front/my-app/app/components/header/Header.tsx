import Link from "next/link";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* 좌측 로고 및 메뉴 */}
        <div className={styles.leftSection}>
          <Link href="/main" className={styles.logo}>
            <span className={styles.logoAccent}>COCA</span>
            <span>Channel</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/main" className={styles.navLink}>
              베스트
            </Link>
            <Link href="/channels" className={styles.navLink}>
              전체채널
            </Link>
          </nav>
        </div>

        {/* 중앙 검색창 */}
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="채널, 게시글 검색..."
            className={styles.searchInput}
          />
        </div>

        {/* 우측 도구 및 버튼 */}
        <div className={styles.rightSection}>
          <ThemeToggle />
          <Link href="/sign-in" className={styles.signInBtn}>
            로그인
          </Link>
          <Link href="/sign-up" className={styles.signUpBtn}>
            회원가입
          </Link>
        </div>
      </div>
    </header>
  );
}