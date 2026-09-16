"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./signIn.module.css";

export default function SignInPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 추후 스프링 부트(/api/auth/login) 백엔드와 연동될 자리
    console.log("로그인 요청 데이터:", formData);
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