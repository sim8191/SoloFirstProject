"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./signIn.module.css";

export default function SignInPage() {
  // 페이지 이동에 사용하는 Next.js Router
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    userId: "",
    userPwd: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 로그인 요청 및 성공 시 메인 페이지 이동
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8081/api/member/sign-in",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.message || "로그인에 실패했습니다."
        );
      }

      // 로그인 성공 후 메인 페이지 이동
      router.push("/main");

    } catch (error) {
      console.error("로그인 실패:", error);

      alert(
        error instanceof Error
          ? error.message
          : "로그인 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>COCA 커뮤니티 계정으로 로그인하세요</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="userId" className={styles.label}>
              아이디
            </label>
            <input
              id="userId"
              name="userId"
              type="text"
              required
              placeholder="아이디를 입력하세요"
              value={formData.userId}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="userPwd" className={styles.label}>
              비밀번호
            </label>
            <input
              id="userPwd"
              name="userPwd"
              type="password"
              required
              placeholder="비밀번호를 입력하세요"
              value={formData.userPwd}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            로그인하기
          </button>
        </form>

        <div className={styles.footerLinks}>
          <Link href="/find-id" className={styles.link}>
            아이디 찾기
          </Link>
          <span className={styles.separator}>|</span>
          <Link href="/find-pwd" className={styles.link}>
            비밀번호 찾기
          </Link>
          <span className={styles.separator}>|</span>
          <Link href="/sign-up" className={styles.link}>
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}