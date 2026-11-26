
"use client";

// 채널 목록 페이지
import { useMemo, useState } from "react";
import styles from "./channels.module.css";

// 채널 목록에 사용할 데이터 타입
interface Channel {
  channelNo: number;
  channelName: string;
  description: string;
  thumbnail: string | null;
  subscriberCount: number;
  createdAt: string;
}

// 백엔드 연결 전에는 실제 채널 데이터가 없음
const CHANNELS: Channel[] = [];

// 채널 목록 페이지
export default function ChannelsPage() {
  // 채널 검색어
  const [search, setSearch] = useState("");

  // 채널 정렬 기준
  const [sort, setSort] = useState<"popular" | "recent">("popular");

  // 검색 및 정렬된 채널 목록
  const filteredChannels = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return CHANNELS.filter((channel) => {
      return (
        channel.channelName.toLowerCase().includes(keyword) ||
        channel.description.toLowerCase().includes(keyword)
      );
    }).sort((a, b) => {
      if (sort === "popular") {
        return b.subscriberCount - a.subscriberCount;
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }, [search, sort]);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        {/* 페이지 제목 및 채널 생성 */}
        <section className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>전체 채널</h1>
            <p className={styles.description}>
              관심 있는 채널을 찾아 다양한 이야기를 나눠보세요.
            </p>
          </div>

          {/* 채널 생성 페이지 구현 후 연결 */}
          <button
            type="button"
            className={styles.createButton}
            disabled
            title="채널 생성 기능 준비 중"
          >
            <span>＋</span>
            채널 만들기
          </button>
        </section>

        {/* 채널 검색 */}
        <section className={styles.searchSection}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="채널 이름이나 설명 검색..."
            className={styles.searchInput}
            aria-label="채널 검색"
          />
        </section>

        {/* 채널 목록 도구 */}
        <section className={styles.channelSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <h2>채널 둘러보기</h2>
              <span className={styles.count}>
                {filteredChannels.length}
              </span>
            </div>

            <div className={styles.sortGroup}>
              <button
                type="button"
                className={
                  sort === "popular"
                    ? styles.sortActive
                    : styles.sortButton
                }
                onClick={() => setSort("popular")}
              >
                인기순
              </button>

              <button
                type="button"
                className={
                  sort === "recent"
                    ? styles.sortActive
                    : styles.sortButton
                }
                onClick={() => setSort("recent")}
              >
                최신순
              </button>
            </div>
          </div>

          {/* 채널 목록 또는 빈 화면 */}
          {filteredChannels.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>▤</div>

              <h3>
                {search.trim()
                  ? "검색 결과가 없습니다."
                  : "아직 등록된 채널이 없습니다."}
              </h3>

              <p>
                {search.trim()
                  ? "다른 검색어로 다시 찾아보세요."
                  : "채널 목록 API를 연결하면 이곳에 채널이 표시됩니다."}
              </p>
            </div>
          ) : (
            <div className={styles.channelGrid}>
              {filteredChannels.map((channel) => (
                <article
                  key={channel.channelNo}
                  className={styles.channelCard}
                >
                  <div className={styles.channelThumbnail}>
                    {channel.thumbnail ? (
                      <img
                        src={channel.thumbnail}
                        alt=""
                        className={styles.thumbnailImage}
                      />
                    ) : (
                      <span>
                        {channel.channelName.charAt(0)}
                      </span>
                    )}
                  </div>

                  <div className={styles.channelInfo}>
                    <h3>{channel.channelName}</h3>
                    <p>{channel.description}</p>
                    <span className={styles.subscriberCount}>
                      구독자 {channel.subscriberCount.toLocaleString()}명
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
