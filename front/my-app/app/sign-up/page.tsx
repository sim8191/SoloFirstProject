"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./signUp.module.css";
import { API_ENDPOINTS, REGEX, VALIDATION_MESSAGES } from "@/lib/constants";

export default function SignUpPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userId: "",
    userPwd: "",
    passwordConfirm: "",
    userName: "",
    userEmail: "",
    userPhone: "",
    userAddress: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.userId.trim()) {
      errors.userId = VALIDATION_MESSAGES.USER_ID.REQUIRED;
    }

    // 2. 비밀번호 검증
    if (!formData.userPwd) {
      errors.userPwd = VALIDATION_MESSAGES.PASSWORD.REQUIRED;
    } else if (!REGEX.PASSWORD.test(formData.userPwd)) {
      errors.userPwd = VALIDATION_MESSAGES.PASSWORD.INVALID;
    }

    // 3. 비밀번호 확인 검증
    if (!formData.passwordConfirm) {
      errors.passwordConfirm = VALIDATION_MESSAGES.PASSWORD.CONFIRM_REQUIRED;
    } else if (formData.userPwd !== formData.passwordConfirm) {
      errors.passwordConfirm = VALIDATION_MESSAGES.PASSWORD.MISMATCH;
    }

    if (!formData.userName.trim()) {
      errors.userName = VALIDATION_MESSAGES.USER_NAME.REQUIRED;
    }

    if (formData.userEmail.trim() && !REGEX.EMAIL.test(formData.userEmail.trim())) {
      errors.userEmail = VALIDATION_MESSAGES.EMAIL.INVALID;
    }

    if (formData.userPhone.trim() && !REGEX.PHONE.test(formData.userPhone.trim())) {
      errors.userPhone = VALIDATION_MESSAGES.PHONE.INVALID;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 선택 입력 필드는 빈 문자열일 경우 null로 전송
      const payload = {
        userId: formData.userId.trim(),
        userPwd: formData.userPwd,
        passwordConfirm: formData.passwordConfirm,
        userName: formData.userName.trim(),
        userEmail: formData.userEmail.trim() || null,
        userPhone: formData.userPhone.trim() || null,
        userAddress: formData.userAddress.trim() || null,
      };

      const response = await fetch(API_ENDPOINTS.AUTH.SIGN_UP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "회원가입 요청에 실패했습니다.");
      }

      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      router.push("/sign-in");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>회원가입</h1>
        <p className={styles.subtitle}>COCA Community에 오신 것을 환영합니다</p>

        {serverError && <div className={styles.errorBanner}>{serverError}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 아이디 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              아이디<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              className={styles.input}
            />
            {fieldErrors.userId && <span className={styles.fieldError}>{fieldErrors.userId}</span>}
          </div>

          {/* 비밀번호 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              비밀번호<span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              name="userPwd"
              value={formData.userPwd}
              onChange={handleChange}
              placeholder="8~32자 영문, 숫자, 특수문자 조합"
              className={styles.input}
            />
            {fieldErrors.userPwd && <span className={styles.fieldError}>{fieldErrors.userPwd}</span>}
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              비밀번호 확인<span className={styles.required}>*</span>
            </label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 한 번 더 입력하세요"
              className={styles.input}
            />
            {fieldErrors.passwordConfirm && (
              <span className={styles.fieldError}>{fieldErrors.passwordConfirm}</span>
            )}
          </div>

          {/* 이름 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              이름<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              className={styles.input}
            />
            {fieldErrors.userName && <span className={styles.fieldError}>{fieldErrors.userName}</span>}
          </div>

          {/* 이메일 (선택) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>이메일 (선택)</label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              placeholder="example@domain.com"
              className={styles.input}
            />
            {fieldErrors.userEmail && <span className={styles.fieldError}>{fieldErrors.userEmail}</span>}
          </div>

          {/* 전화번호 (선택) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>전화번호 (선택)</label>
            <input
              type="tel"
              name="userPhone"
              value={formData.userPhone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className={styles.input}
            />
            {fieldErrors.userPhone && <span className={styles.fieldError}>{fieldErrors.userPhone}</span>}
          </div>

          {/* 주소 (선택) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>주소 (선택)</label>
            <input
              type="text"
              name="userAddress"
              value={formData.userAddress}
              onChange={handleChange}
              placeholder="주소를 입력하세요"
              className={styles.input}
            />
          </div>

          <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? "가입 처리 중..." : "가입하기"}
          </button>
        </form>

        <div className={styles.footerText}>
          이미 계정이 있으신가요?
          <Link href="/sign-in" className={styles.footerLink}>
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}