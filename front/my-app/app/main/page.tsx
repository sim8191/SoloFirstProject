import styles from "./main.module.css";

export default function MainPage() {
  const dummyPosts = [
    {
      id: 1,
      channel: "공지",
      title: "SoloFirstProject 커뮤니티 개발 환경 세팅 완료",
      author: "운영자",
      upvotes: 24,
      time: "방금 전",
    },
    {
      id: 2,
      channel: "자유",
      title: "Next.js와 Spring Boot 연동 시작해 봅니다.",
      author: "개발초보",
      upvotes: 11,
      time: "15분 전",
    },
    {
      id: 3,
      channel: "질문",
      title: "다크모드/라이트모드 CSS 변수 적용 테스트 글",
      author: "익명",
      upvotes: 5,
      time: "1시간 전",
    },
  ];

  return (
    <div className={styles.container}>
      {/* 배너 영역 */}
      <section className={styles.banner}>
        <h1 className={styles.title}>🔥 실시간 커뮤니티 피드</h1>
        <p className={styles.description}>
          아카라이브 스타일의 채널 게시판 메인 페이지 테스트 화면입니다.
        </p>
      </section>

      {/* 상태 체크 카드 그리드 */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>FRONTEND</div>
          <div className={styles.cardValue}>Next.js 15 (App Router)</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>BACKEND</div>
          <div className={styles.cardValue}>Spring Boot & JPA</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardLabel}>DATABASE</div>
          <div className={styles.cardValue}>Oracle DB</div>
        </div>
      </div>

      {/* 인기글 목록 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>📌 실시간 인기글</div>
        <ul className={styles.postList}>
          {dummyPosts.map((post) => (
            <li key={post.id} className={styles.postItem}>
              <div>
                <span className={styles.postChannel}>{post.channel}</span>
                <span className={styles.postTitle}>{post.title}</span>
              </div>
              <div className={styles.postMeta}>
                <span>{post.author}</span>
                <span className={styles.postUpvotes}>+{post.upvotes}</span>
                <span>{post.time}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}