# 린다애스크 (Rinda Video Ask)

> 대한민국 최초의 AI 기반 대화형 비디오 위젯 솔루션

[English](./README_EN.md) | 한국어

## 프로젝트 소개

린다애스크는 웹사이트에 개인화된 비디오 메시지를 삽입하여 방문자의 행동에 따라 자동 재생하고, 비디오/음성/텍스트 응답을 수집하며, 실시간 AI 번역과 리드 인텔리전스를 제공하는 B2B SaaS 솔루션입니다.

### 핵심 가치
- **개인화된 비디오 소통**: 웹사이트 방문자에게 맞춤형 비디오 메시지 전달
- **AI 기반 응대**: 24시간 AI가 고객 문의에 응대
- **스마트 미팅 예약**: 캘린더 연동을 통한 간편한 미팅 예약
- **리드 인텔리전스**: AI가 자동으로 리드 분석 및 점수화

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| **모노레포** | Turborepo + pnpm workspaces |
| **Studio App** | Next.js 15, React 19, TypeScript, Tailwind CSS 4 |
| **Widget SDK** | Vanilla TypeScript, Vite (< 50kb) |
| **데이터베이스** | Supabase (PostgreSQL + pgvector) |
| **인증** | Supabase Auth (Google, Kakao OAuth) |
| **AI 파이프라인** | OpenAI Whisper, Claude, Rinda.ai 번역 |
| **스토리지** | Supabase Storage |
| **국제화** | next-intl (한국어/영어) |

---

## 프로젝트 구조

```
rinda-video-ask/
├── apps/
│   ├── studio/              # Next.js 대시보드 앱
│   │   ├── src/
│   │   │   ├── app/         # App Router 페이지
│   │   │   ├── components/  # React 컴포넌트
│   │   │   │   └── widget/  # 통합 위젯 컴포넌트
│   │   │   ├── hooks/       # 커스텀 훅
│   │   │   └── lib/         # 유틸리티 & 설정
│   │   └── messages/        # i18n 번역 파일
│   └── widget/              # 임베드 가능한 위젯 SDK
├── packages/
│   ├── database/            # Supabase 타입 & 클라이언트
│   ├── ui/                  # 공유 UI 컴포넌트
│   └── ai-engine/           # AI 처리 유틸리티
├── supabase/
│   ├── migrations/          # 데이터베이스 스키마
│   └── functions/           # Edge Functions
└── ...
```

---

## 기능 현황

### ✅ 현재 작동하는 기능 (데모 모드)

#### 통합 위젯 (Unified Widget)
- **비디오 모드**: 환영 비디오 재생, 재생/일시정지 제어
- **채팅 모드**: AI 응대 채팅 (키워드 기반 데모 응답)
- **캘린더 모드**: 날짜/시간 선택 → 연락처 입력 → 예약 완료 플로우

#### Studio 대시보드
- 반응형 레이아웃 (모바일/데스크톱)
- 다국어 지원 (한국어/영어)
- 메인 랜딩 페이지
- 데모 체험 페이지 (`/demo`)
- 회원가입/로그인 페이지
- 대시보드 레이아웃
- 설정 페이지 구조

#### 데모 모드 지원
- Supabase 연결 없이 앱 실행 가능
- 목업 데이터로 모든 UI 기능 테스트 가능
- 위젯의 채팅/캘린더 기능 시뮬레이션

---

### 🔧 추가 개발이 필요한 기능 (목업 상태)

#### 우선순위 높음
| 기능 | 현재 상태 | 필요 작업 |
|------|----------|----------|
| **Supabase 연동** | 목업 클라이언트 | 실제 Supabase 프로젝트 연결, 마이그레이션 실행 |
| **사용자 인증** | UI만 구현 | Supabase Auth 연동, OAuth 설정 (Google, Kakao) |
| **Claude AI 연동** | 데모 응답만 | `ANTHROPIC_API_KEY` 설정, 실제 AI 응답 활성화 |
| **비디오 녹화** | 텔레프롬프터 UI만 | MediaRecorder API 연동, Supabase Storage 업로드 |

#### 우선순위 중간
| 기능 | 현재 상태 | 필요 작업 |
|------|----------|----------|
| **Google Calendar 연동** | 플레이스홀더 | OAuth 설정, freebusy 조회, 이벤트 생성 |
| **리드 관리** | UI만 구현 | leads 테이블 CRUD, 이메일 알림 |
| **지식베이스** | UI만 구현 | knowledge_base 테이블, 문서 임베딩 (pgvector) |
| **분석 대시보드** | 차트 UI만 | analytics 테이블, 집계 쿼리 |

#### 우선순위 낮음
| 기능 | 현재 상태 | 필요 작업 |
|------|----------|----------|
| **Widget SDK 배포** | 개발 버전 | CDN 배포, 버전 관리 |
| **음성 전사** | 미구현 | OpenAI Whisper API 연동 |
| **다국어 번역** | 미구현 | Rinda.ai 또는 Claude 번역 파이프라인 |
| **BANT 스코어링** | 미구현 | AI 분석 프롬프트 개발 |

---

## 시작하기

### 사전 요구사항
- Node.js 20+
- pnpm 9+
- (선택) Supabase 계정

### 설치

```bash
# 저장소 클론
git clone https://github.com/FINGU-GRINDA/rinda-video-ask.git
cd rinda-video-ask

# 의존성 설치
pnpm install

# 개발 서버 시작 (데모 모드)
pnpm dev
```

### 환경 변수 (프로덕션용)

`.env.local` 파일 생성:

```env
# Supabase (프로덕션 필수)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OAuth (선택)
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI 서비스 (선택)
ANTHROPIC_API_KEY=your-claude-api-key
OPENAI_API_KEY=your-openai-api-key

# Google Calendar (선택)
GOOGLE_CALENDAR_ID=
GOOGLE_SERVICE_ACCOUNT_KEY=
```

> **참고**: 환경 변수 없이도 데모 모드로 앱이 실행됩니다.

---

## 스크립트

```bash
pnpm dev          # 모든 앱 개발 서버 시작
pnpm build        # 모든 앱 빌드
pnpm studio       # Studio 앱만 시작
pnpm widget       # Widget SDK 빌드
pnpm lint         # ESLint 실행
pnpm type-check   # TypeScript 타입 체크
```

---

## 아키텍처

### 위젯 모드 시스템

```
UnifiedWidget
├── video (기본)  - 환영 비디오 재생
├── chat         - AI 기반 실시간 채팅
└── calendar     - 미팅 예약 캘린더
```

### API 엔드포인트

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/widget/chat` | POST | AI 채팅 응답 |
| `/api/widget/calendar/availability` | GET | 예약 가능 시간 조회 |
| `/api/widget/calendar/book` | POST | 미팅 예약 생성 |

### 데이터 흐름

```
방문자 → 위젯 → API → Supabase
                    ↓
            Edge Function → AI 파이프라인
                    ↓
            리드 → 대시보드
```

---

## 라이선스

MIT

---

## 기여하기

1. 이 저장소를 Fork 합니다
2. Feature 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

---

Built with ❤️ by the Rinda Team
