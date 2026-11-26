
"use client";

// 채널 생성 페이지
import { useRef, useState } from "react";
import Link from "next/link";
import styles from "./create.module.css";

// 채널 생성 비용 및 입력 제한
const CHANNEL_CREATE_COST = 10;
const MAX_CHANNEL_NAME = 50;
const MAX_CHANNEL_DESCRIPTION = 500;
const MAX_CATEGORY_NAME = 30;
const MAX_CATEGORY_COUNT = 20;

// 게시글 카테고리 타입
interface BoardCategory {
  id: number;
  name: string;
}

// 채널 생성 페이지
export default function ChannelCreatePage() {
  // 채널 기본정보
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");

  // 게시글 카테고리 목록
  const [categories, setCategories] = useState<BoardCategory[]>([
    { id: 1, name: "자유게시판" },
  ]);

  // 신규 카테고리 입력
  const [newCategoryName, setNewCategoryName] = useState("");

  // 카테고리 이름 수정
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // 카테고리 입력 오류
  const [categoryError, setCategoryError] = useState("");

  // 카테고리 식별번호
  const nextCategoryId = useRef(2);

  // 카테고리 이름 중복 확인
  const isDuplicateName = (name: string, excludeId?: number) => {
    return categories.some(
      (category) =>
        category.id !== excludeId &&
        category.name.toLowerCase() === name.toLowerCase()
    );
  };

  // 새로운 게시글 카테고리 추가
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
      setCategoryError("이미 존재하는 카테고리 이름입니다.");
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
      setCategoryError("이미 존재하는 카테고리 이름입니다.");
      return;
    }

    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, name } : category
      )
    );

    setEditingId(null);
    setEditingName("");
    setCategoryError("");
  };

  // 카테고리 이름 수정 취소
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

  // 카테고리 순서 변경
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
          onSubmit={(event) => event.preventDefault()}
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
                  채널에서 사용할 게시글 분류를 설정해 주세요.
                </p>
              </div>

              <span className={styles.categoryCount}>
                {categories.length}/{MAX_CATEGORY_COUNT}
              </span>
            </div>

            {/* 등록된 카테고리 목록 */}
            <div className={styles.categoryList}>
              {categories.length === 0 ? (
                <div className={styles.categoryEmpty}>
                  등록된 카테고리가 없습니다.
                  <span>
                    카테고리를 추가하지 않으면 생성 시
                    자유게시판이 기본으로 설정됩니다.
                  </span>
                </div>
              ) : (
                categories.map((category, index) => (
                  <div
                    key={category.id}
                    className={styles.categoryItem}
                  >
                    <span className={styles.categoryOrder}>
                      {index + 1}
                    </span>

                    {editingId === category.id ? (
                      /* 카테고리 이름 수정 모드 */
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
                      /* 일반 카테고리 표시 모드 */
                      <>
                        <span className={styles.categoryName}>
                          {category.name}
                        </span>

                        <div className={styles.categoryActions}>
                          <button
                            type="button"
                            className={styles.iconButton}
                            aria-label={`${category.name} 위로 이동`}
                            title="위로 이동"
                            disabled={index === 0}
                            onClick={() =>
                              moveCategory(index, -1)
                            }
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            className={styles.iconButton}
                            aria-label={`${category.name} 아래로 이동`}
                            title="아래로 이동"
                            disabled={
                              index === categories.length - 1
                            }
                            onClick={() =>
                              moveCategory(index, 1)
                            }
                          >
                            ↓
                          </button>

                          <button
                            type="button"
                            className={styles.editButton}
                            onClick={() =>
                              startEditCategory(category)
                            }
                          >
                            수정
                          </button>

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

            {/* 신규 카테고리 입력 */}
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

            {categoryError && (
              <p className={styles.errorText} role="alert">
                {categoryError}
              </p>
            )}

            <p className={styles.helpText}>
              카테고리 이름은 최대 {MAX_CATEGORY_NAME}자이며,
              목록의 화살표 버튼으로 표시 순서를 변경할 수 있습니다.
            </p>
          </section>

          {/* 채널 생성 포인트 안내 */}
          <section className={styles.pointBox}>
            <div className={styles.pointRow}>
              <span>채널 생성 비용</span>
              <strong>{CHANNEL_CREATE_COST} P</strong>
            </div>

            <p>
              채널 생성이 완료되면 보유 포인트에서
              {" "}{CHANNEL_CREATE_COST}P가 차감됩니다.
            </p>

            <p>
              생성한 회원은 해당 채널의 소유자로 등록되며,
              채널과 게시글 카테고리를 관리할 수 있습니다.
            </p>
          </section>

          {/* 페이지 하단 버튼 */}
          <div className={styles.actions}>
            <Link
              href="/main/channels"
              className={styles.cancelButton}
            >
              취소
            </Link>

            {/* 실제 생성 API 구현 후 활성화 */}
            <button
              type="submit"
              className={styles.submitButton}
              disabled
              title="채널 생성 API 연결 예정"
            >
              채널 생성하기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
