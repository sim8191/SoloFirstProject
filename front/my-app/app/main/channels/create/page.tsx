
"use client";

// 채널 생성 페이지
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./create.module.css";

// 채널 생성 비용과 입력 제한
const CHANNEL_CREATE_COST = 10; // 체널 생성 비용
const MAX_CHANNEL_NAME = 50;
const MAX_CHANNEL_DESCRIPTION = 500;
const MAX_CATEGORY_NAME = 30;
const MAX_CATEGORY_COUNT = 20;

// Spring Boot API 주소
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8081";

// 게시글 카테고리 타입
interface BoardCategory {
  id: number;
  name: string;
}

// 채널 생성 페이지
export default function ChannelCreatePage() {
  // 페이지 이동
  const router = useRouter();

  // 채널 기본정보
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");

  // 실제 저장할 카테고리 (전체는 제외)
  const [categories, setCategories] = useState<BoardCategory[]>([]);

  // 신규 카테고리 입력
  const [newCategoryName, setNewCategoryName] = useState("");

  // 카테고리 이름 수정
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // 카테고리 입력 오류
  const [categoryError, setCategoryError] = useState("");

  // 채널 생성 요청 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // 프론트엔드 카테고리 식별번호
  const nextCategoryId = useRef(1);

  // 로그인 여부 확인 전에는 채널 생성 폼을 표시하지 않음
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // 페이지 직접 접근 시 로그인 상태 확인
  useEffect(() => {
    const controller = new AbortController();

    async function checkAuthentication() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/member/me`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          router.replace("/sign-in");
          return;
        }

        if (!controller.signal.aborted) {
          setIsAuthChecking(false);
        }
      } catch {
        if (!controller.signal.aborted) {
          router.replace("/sign-in");
        }
      }
    }

    void checkAuthentication();

    return () => controller.abort();
  }, [router]);

  // 카테고리 이름 중복 및 예약어 확인
  const isDuplicateName = (name: string, excludeId?: number) => {
    const normalized = name.trim().toLowerCase();

    // '전체'는 고정 조회 메뉴이므로 등록 불가
    if (normalized === "전체") {
      return true;
    }

    return categories.some(
      (category) =>
        category.id !== excludeId &&
        category.name.trim().toLowerCase() === normalized
    );
  };

  // 신규 카테고리 추가
  const addCategory = () => {
    const name = newCategoryName.trim();

    if (!name) {
      setCategoryError("카테고리 이름을 입력해 주세요.");
      return;
    }

    if (categories.length >= MAX_CATEGORY_COUNT) {
      setCategoryError(
        `카테고리는 최대 ${MAX_CATEGORY_COUNT}개까지 추가할 수 있습니다.`
      );
      return;
    }

    if (isDuplicateName(name)) {
      setCategoryError(
        "중복된 카테고리 이름이거나 사용할 수 없는 이름입니다."
      );
      return;
    }

    setCategories((prev) => [
      ...prev,
      {
        id: nextCategoryId.current++,
        name,
      },
    ]);

    setNewCategoryName("");
    setCategoryError("");
  };

  // 카테고리 이름 수정 시작
  const startEditCategory = (category: BoardCategory) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setCategoryError("");
  };

  // 카테고리 이름 수정 저장
  const saveEditCategory = (id: number) => {
    const name = editingName.trim();

    if (!name) {
      setCategoryError("카테고리 이름은 비워둘 수 없습니다.");
      return;
    }

    if (isDuplicateName(name, id)) {
      setCategoryError(
        "중복된 카테고리 이름이거나 사용할 수 없는 이름입니다."
      );
      return;
    }

    setCategories((prev) =>
      prev.map((category) =>
        category.id === id
          ? { ...category, name }
          : category
      )
    );

    setEditingId(null);
    setEditingName("");
    setCategoryError("");
  };

  // 카테고리 수정 취소
  const cancelEditCategory = () => {
    setEditingId(null);
    setEditingName("");
    setCategoryError("");
  };

  // 카테고리 삭제
  const removeCategory = (id: number) => {
    setCategories((prev) =>
      prev.filter((category) => category.id !== id)
    );

    if (editingId === id) {
      setEditingId(null);
      setEditingName("");
    }

    setCategoryError("");
  };

  // 사용자 카테고리의 순서 변경 (전체는 제외)
  const moveCategory = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= categories.length) {
      return;
    }

    setCategories((prev) => {
      const updated = [...prev];

      [updated[index], updated[targetIndex]] = [
        updated[targetIndex],
        updated[index],
      ];

      return updated;
    });
  };

  // 채널 생성 요청
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAuthChecking || isSubmitting) return;

    const name = channelName.trim();
    const description = channelDescription.trim();

    // 채널 필수 입력 검사
    if (!name || !description) {
      setSubmitError("채널 이름과 소개를 입력해 주세요.");
      return;
    }

    // 카테고리 수정 중에는 생성하지 않음
    if (editingId !== null) {
      setSubmitError("카테고리 수정을 먼저 완료해 주세요.");
      return;
    }

    // 입력 중인 카테고리는 추가 버튼으로 확정하도록 안내
    if (newCategoryName.trim()) {
      setSubmitError(
        "작성 중인 카테고리를 추가하거나 입력을 지워 주세요."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // 1. 현재 로그인 세션의 CSRF 토큰 조회
      const csrfResponse = await fetch(
        `${API_BASE_URL}/api/member/csrf`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!csrfResponse.ok) {
        throw new Error(
          "로그인 상태를 확인할 수 없습니다. 다시 로그인해 주세요."
        );
      }

      const csrfData: { token: string } =
        await csrfResponse.json();

      // 2. 채널 생성 API 요청
      const response = await fetch(
        `${API_BASE_URL}/api/channels`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfData.token,
          },
          body: JSON.stringify({
            channelName: name,
            channelDescription: description,

            // 전체는 DB에 저장하지 않음
            categories: categories.map((category, index) => ({
              categoryName: category.name,
              displayOrder: index + 1,
            })),
          }),
        }
      );

      // 3. 서버 오류 메시지 처리
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.message || "채널 생성에 실패했습니다."
        );
      }

      // 4. 생성 성공 후 채널 목록으로 이동
      router.push("/main/channels");
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "채널 생성 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로그인 확인 전에는 채널 생성 화면을 숨김
  if (isAuthChecking) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          로그인 상태를 확인하고 있습니다...
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* 상단 경로 */}
        <div className={styles.breadcrumb}>
          <Link href="/main/channels">전체 채널</Link>
          <span>/</span>
          <span>채널 만들기</span>
        </div>

        {/* 페이지 제목 */}
        <div className={styles.pageHeader}>
          <h1>새 채널 만들기</h1>
          <p>
            채널 정보와 게시글 카테고리를 설정해 주세요.
          </p>
        </div>

        {/* 채널 생성 폼 */}
        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          {/* 채널 이름 */}
          <section className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="channelName">
                채널 이름
                <span className={styles.required}> *</span>
              </label>

              <span>
                {channelName.length}/{MAX_CHANNEL_NAME}
              </span>
            </div>

            <input
              id="channelName"
              type="text"
              className={styles.input}
              value={channelName}
              maxLength={MAX_CHANNEL_NAME}
              required
              placeholder="채널 이름을 입력하세요"
              onChange={(event) =>
                setChannelName(event.target.value)
              }
            />

            <p className={styles.helpText}>
              다른 회원들이 쉽게 알아볼 수 있는 이름을 사용해 주세요.
            </p>
          </section>

          {/* 채널 소개 */}
          <section className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="channelDescription">
                채널 소개
                <span className={styles.required}> *</span>
              </label>

              <span>
                {channelDescription.length}/{MAX_CHANNEL_DESCRIPTION}
              </span>
            </div>

            <textarea
              id="channelDescription"
              className={styles.textarea}
              value={channelDescription}
              maxLength={MAX_CHANNEL_DESCRIPTION}
              required
              placeholder="어떤 이야기를 나누는 채널인지 소개해 주세요."
              onChange={(event) =>
                setChannelDescription(event.target.value)
              }
            />
          </section>

          {/* 게시글 카테고리 설정 */}
          <section className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <div>
                <h2>게시글 카테고리 설정</h2>
                <p>
                  전체는 고정이며, 그 아래에 카테고리를 추가할 수 있습니다.
                </p>
              </div>

              <span className={styles.categoryCount}>
                {categories.length}/{MAX_CATEGORY_COUNT}
              </span>
            </div>

            {/* 카테고리 목록 */}
            <div className={styles.categoryList}>
              {/* 수정 및 삭제할 수 없는 전체 메뉴 */}
              <div className={styles.categoryItem}>
                <span className={styles.categoryOrder}>1</span>
                <span className={styles.categoryName}>전체</span>
                <span className={styles.fixedCategory}>고정</span>
              </div>

              {/* 사용자 카테고리 목록 */}
              {categories.length === 0 ? (
                <div className={styles.categoryEmpty}>
                  추가된 게시글 카테고리가 없습니다.
                  <span>
                    필요하면 아래에서 카테고리를 추가해 주세요.
                  </span>
                </div>
              ) : (
                categories.map((category, index) => (
                  <div
                    key={category.id}
                    className={styles.categoryItem}
                  >
                    {/* 전체 다음부터 번호 표시 */}
                    <span className={styles.categoryOrder}>
                      {index + 2}
                    </span>

                    {editingId === category.id ? (
                      /* 카테고리 이름 수정 */
                      <div className={styles.categoryEdit}>
                        <input
                          type="text"
                          value={editingName}
                          maxLength={MAX_CATEGORY_NAME}
                          className={styles.categoryInput}
                          aria-label="카테고리 이름 수정"
                          onChange={(event) =>
                            setEditingName(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              saveEditCategory(category.id);
                            }

                            if (event.key === "Escape") {
                              cancelEditCategory();
                            }
                          }}
                        />

                        <button
                          type="button"
                          className={styles.smallPrimaryButton}
                          onClick={() =>
                            saveEditCategory(category.id)
                          }
                        >
                          저장
                        </button>

                        <button
                          type="button"
                          className={styles.smallButton}
                          onClick={cancelEditCategory}
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      /* 일반 카테고리 */
                      <>
                        <span className={styles.categoryName}>
                          {category.name}
                        </span>

                        <div className={styles.categoryActions}>
                          {/* 위로 이동 */}
                          <button
                            type="button"
                            className={styles.iconButton}
                            title="위로 이동"
                            aria-label={`${category.name} 위로 이동`}
                            disabled={index === 0}
                            onClick={() =>
                              moveCategory(index, -1)
                            }
                          >
                            ↑
                          </button>

                          {/* 아래로 이동 */}
                          <button
                            type="button"
                            className={styles.iconButton}
                            title="아래로 이동"
                            aria-label={`${category.name} 아래로 이동`}
                            disabled={
                              index === categories.length - 1
                            }
                            onClick={() =>
                              moveCategory(index, 1)
                            }
                          >
                            ↓
                          </button>

                          {/* 이름 수정 */}
                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={() =>
                              startEditCategory(category)
                            }
                          >
                            수정
                          </button>

                          {/* 삭제 */}
                          <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={() =>
                              removeCategory(category.id)
                            }
                          >
                            삭제
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* 새로운 카테고리 입력 */}
            <div className={styles.categoryAddRow}>
              <input
                type="text"
                className={styles.categoryInput}
                value={newCategoryName}
                maxLength={MAX_CATEGORY_NAME}
                placeholder="새 카테고리 이름"
                aria-label="새 게시글 카테고리 이름"
                onChange={(event) => {
                  setNewCategoryName(event.target.value);
                  setCategoryError("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addCategory();
                  }
                }}
              />

              <button
                type="button"
                className={styles.addButton}
                onClick={addCategory}
                disabled={categories.length >= MAX_CATEGORY_COUNT}
              >
                + 추가
              </button>
            </div>

            {/* 카테고리 오류 */}
            {categoryError && (
              <p className={styles.errorText} role="alert">
                {categoryError}
              </p>
            )}

            <p className={styles.helpText}>
              카테고리 이름은 최대 {MAX_CATEGORY_NAME}자이며,
              표시 순서는 화살표로 변경할 수 있습니다.
              전체는 모든 게시글을 보여주는 고정 메뉴입니다.
            </p>
          </section>

          {/* 포인트 사용 안내 */}
          <section className={styles.pointBox}>
            <div className={styles.pointRow}>
              <span>채널 생성 비용</span>
              <strong>{CHANNEL_CREATE_COST} P</strong>
            </div>

            <p>
              채널 생성이 완료되면 보유 포인트에서{" "}
              {CHANNEL_CREATE_COST}P가 차감됩니다.
            </p>

            <p>
              생성한 회원은 해당 채널의 소유자로 등록되며,
              채널과 게시글 카테고리를 관리할 수 있습니다.
            </p>
          </section>

          {/* 채널 생성 오류 */}
          {submitError && (
            <p className={styles.errorText} role="alert">
              {submitError}
            </p>
          )}

          {/* 하단 버튼 */}
          <div className={styles.actions}>
            <Link
              href="/main/channels"
              className={styles.cancelButton}
            >
              취소
            </Link>

            {/* 채널 생성 제출 */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled={
                isAuthChecking ||
                isSubmitting ||
                !channelName.trim() ||
                !channelDescription.trim() ||
                editingId !== null
              }
            >
              {isSubmitting ? "생성 중..." : "채널 생성하기"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
