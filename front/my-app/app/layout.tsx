import "./globals.css";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Footer from "./components/footer/Footer";

export const metadata = {
  title: "Coca Community",
  description: "아카라이브 스타일 커뮤니티 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        
        {/* 중앙 본문 영역: 사이드바 + 메인 콘텐츠 */}
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />
          <main style={{ flex: 1, minWidth: 0 }}>
            {children}
          </main>
        </div>

        <Footer />
      </body>
    </html>
  );
}