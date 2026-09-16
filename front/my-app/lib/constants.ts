/**
 * 프론트엔드 공통 상수 및 정규식 규칙 정의 모듈
 */

// 1. 백엔드 API 기본 주소 (환경변수가 있으면 우선 사용, 없으면 로컬 기본값)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081";

// 2. 주요 API 엔드포인트 모음
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_UP: `${API_BASE_URL}/api/member/signup`,
    SIGN_IN: `${API_BASE_URL}/api/member/signin`,
  },
  MEMBER: {
    CHECK_ID: `${API_BASE_URL}/api/member/check-id`,
    CHECK_EMAIL: `${API_BASE_URL}/api/member/check-email`,
  },
} as const;

// 3. 입력값 검증용 정규표현식 (백엔드 정책과 1:1 일치)
export const REGEX = {
  // 아이디: 4~20자 영문 및 숫자 조합
  USER_ID: /^[a-zA-Z0-9]{4,20}$/,

  // 비밀번호: 8~32자 영문, 숫자, 특수문자를 각각 최소 1개 이상 포함
  PASSWORD:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,32}$/,

  // 휴대전화: 한국 통신사 기준 010-XXXX-XXXX (하이픈 유무 모두 지원)
  PHONE: /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,

  // 이메일 표준 형식
  EMAIL: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
} as const;

// 4. 유효성 검사 안내 및 에러 메시지
export const VALIDATION_MESSAGES = {
  USER_ID: {
    REQUIRED: "아이디를 입력해주세요.",
    INVALID: "아이디는 4자 이상 20자 이하의 영문/숫자로 입력해주세요.",
  },
  USER_NAME: {
    REQUIRED: "이름을 입력해주세요.",
  },
  PASSWORD: {
    REQUIRED: "비밀번호를 입력해주세요.",
    INVALID: "비밀번호는 8~32자 영문, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.",
    CONFIRM_REQUIRED: "비밀번호 확인을 입력해주세요.",
    MISMATCH: "비밀번호가 일치하지 않습니다.",
  },
  EMAIL: {
    INVALID: "올바른 이메일 형식이 아닙니다.",
  },
  PHONE: {
    INVALID: "올바른 휴대전화 번호 형식이 아닙니다. (예: 010-1234-5678)",
  },
} as const;