"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      // 1024px 이하로 줄어들면 자동으로 닫힘
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const majorChannels = [
    { name: "종합/자유", path: "/c/free", count: "99+" },
    { name: "개발/IT", path: "/c/dev", count: "42" },
    { name: "게임 채널", path: "/c/game", count: "18" },
    { name: "유머/이슈", path: "/c/humor", count: "57" },
    { name: "애니/만화", path: "/c/anime", count: "23" },
  ];

  const subChannels = [
    { name: "공지사항", path: "/notice" },
    { name: "문의 및 신고", path: "/support" },
    { name: "채널 개설 신청", path: "/channel/new" },
  ];

  return (
    <div className={styles.sidebarWrapper}>
      {/* 1. 사이드바가 닫혔을 때 나타나는 플로팅 열기 버튼 */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={styles.openFloatingBtn}
          title="사이드바 열기"
          aria-label="사이드바 열기"
        >
          ☰
        </button>
      )}

      {/* 2. 사이드바 본체 */}
      <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ""}`}>
        <div className={styles.inner}>
          {/* 상단 닫기 컨트롤 영역 */}
          <div className={styles.headerRow}>
            <span style={{ fontSize: "13px", fontWeight: "bold", color: "var(--text-muted)" }}>
              NAVIGATION
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
              title="사이드바 접기"
              aria-label="사이드바 접기"
            >
              ✕
            </button>
          </div>

          {/* 주요 채널 섹션 */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>주요 채널</div>
            <ul className={styles.menuList}>
              {majorChannels.map((item) => (
                <li key={item.path} className={styles.menuItem}>
                  <Link href={item.path}>
                    <span>{item.name}</span>
                    <span className={styles.badge}>{item.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* 커뮤니티 관리 및 안내 */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>커뮤니티</div>
            <ul className={styles.menuList}>
              {subChannels.map((item) => (
                <li key={item.path} className={styles.menuItem}>
                  <Link href={item.path}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </div>
  );
}