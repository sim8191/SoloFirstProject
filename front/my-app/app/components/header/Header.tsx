
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ThemeToggle from "../theme-toggle/ThemeToggle";
import styles from "./header.module.css";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

// 헤더에 표시할 회원정보 타입
interface HeaderMember {
  userName: string;
  authority: number;
}

// 회원 권한을 화면에 표시할 문자열로 변환
function getAuthorityName(authority: number): string {
  switch (authority) {
    case 1:
      return "관리자";
    case 2:
      return "인증 회원";
    case 3:
      return "일반 회원";
    default:
      return "회원";
  }
}

// 공통 헤더 컴포넌트
export default function Header() {
  // 현재 회원정보
  const [member, setMember] = useState<HeaderMember | null>(null);

  // 드롭다운 열림 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 드롭다운 영역 참조
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 현재 페이지 경로
  const pathname = usePathname();

  // 페이지 이동을 위한 Next.js Router
  const router = useRouter();

  // 로그아웃 요청 진행 상태
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 로그아웃 요청 처리
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // 1. 서버에서 CSRF 토큰 가져오기
      const csrfResponse = await fetch(
        "http://localhost:8081/api/member/csrf",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!csrfResponse.ok) {
        throw new Error("보안 토큰을 가져오지 못했습니다.");
      }

      const csrfData: { token: string } = await csrfResponse.json();

      // 2. 로그아웃 요청
      const response = await fetch(
        "http://localhost:8081/api/member/sign-out",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRF-TOKEN": csrfData.token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("로그아웃에 실패했습니다.");
      }

      // 3. 로그아웃 성공 후 회원정보 초기화
      setMember(null);
      setIsMenuOpen(false);

      // 4. 메인 페이지로 이동
      router.replace("/main");
      router.refresh();
    } catch (error) {
      console.error("로그아웃 실패:", error);

      alert(
        error instanceof Error
          ? error.message
          : "로그아웃 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 실제 서버 세션에서 회원정보 조회
  useEffect(() => {
    const controller = new AbortController();

    async function loadMember() {
      try {
        const response = await fetch(
          "http://localhost:8081/api/member/me",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          setMember(null);
          return;
        }

        const data: HeaderMember = await response.json();
        setMember(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          setMember(null);
          console.error("회원정보 조회 실패:", error);
        }
      }
    }

    void loadMember();

    return () => controller.abort();
  }, [pathname]);

  // 메뉴 외부 클릭 및 ESC 입력 시 드롭다운 닫기
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  // 메뉴 항목 선택 시 드롭다운 닫기
  const closeMenu = () => setIsMenuOpen(false);

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

        {/* 우측 도구 및 회원 메뉴 */}
        <div className={styles.rightSection}>
          <ThemeToggle />

          {member ? (
            <div
              className={styles.memberDropdown}
              ref={dropdownRef}
            >
              {/* 회원 이름 클릭 버튼 */}
              <button
                type="button"
                className={styles.memberButton}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className={styles.memberAvatar}>
                  {member.userName.charAt(0)}
                </span>

                <span className={styles.memberName}>
                  {member.userName}
                </span>

                <span className={styles.dropdownArrow}>
                  {isMenuOpen ? "▴" : "▾"}
                </span>
              </button>

              {/* 드롭다운 메뉴 */}
              {isMenuOpen && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownProfile}>
                    <strong>{member.userName}님</strong>
                    <span>
                      {getAuthorityName(member.authority)}
                    </span>
                  </div>

                  <div className={styles.dropdownDivider} />

                  <Link
                    href="/my-page"
                    className={styles.dropdownItem}
                    onClick={closeMenu}
                  >
                    마이페이지
                  </Link>

                  <Link
                    href="/settings"
                    className={styles.dropdownItem}
                    onClick={closeMenu}
                  >
                    환경설정
                  </Link>

                  {/* 관리자만 표시 */}
                  {member.authority === 1 && (
                    <Link
                      href="/admin"
                      className={styles.dropdownItem}
                      onClick={closeMenu}
                    >
                      관리자 페이지
                    </Link>
                  )}

                  <div className={styles.dropdownDivider} />

                  {/* 로그아웃 버튼 */}
                  <button
                    type="button"
                    className={styles.logoutItem}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/sign-in" className={styles.signInBtn}>
                로그인
              </Link>
              <Link href="/sign-up" className={styles.signUpBtn}>
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
