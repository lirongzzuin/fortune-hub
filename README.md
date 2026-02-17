# 소확잼 — 매일 새로운 재미를 만나는 일상 콘텐츠 허브

> **"소소하지만 확실한 재미"** — 운세·사주·성격 테스트·상식 퀴즈·두뇌 게임을 1분 안에 즐기는 모바일 퍼스트 웹 서비스

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)](https://fortune-hub-phi.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**[🚀 라이브 데모 보기](https://fortune-hub-phi.vercel.app/)**

---

## 목차

- [프로젝트 개요](#-프로젝트-개요)
- [핵심 기능](#-핵심-기능)
- [기술 스택](#-기술-스택)
- [아키텍처 설계](#-아키텍처-설계)
- [프로젝트 구조](#-프로젝트-구조)
- [핵심 엔진 설계](#-핵심-엔진-설계)
- [라우팅 구조](#-라우팅-구조)
- [수익화 구조](#-수익화-구조)
- [로컬 개발 가이드](#-로컬-개발-가이드)
- [콘텐츠 확장 가이드](#-콘텐츠-확장-가이드)
- [배포](#-배포)
- [향후 로드맵](#-향후-로드맵)

---

## 📌 프로젝트 개요

소확잼은 **백엔드 서버 없이** 순수 클라이언트 사이드 연산만으로 개인화된 운세·테스트·퀴즈·게임 결과를 제공하는 콘텐츠 플랫폼입니다.

### 핵심 설계 원칙

| 원칙 | 구현 방식 |
|------|-----------|
| **무서버 개인화** | 생년월일 해시 기반 시드 → DB 없이 개인별 고유 결과 |
| **데일리 리텐션** | 날짜 시드 조합 → 매일 새로운 결과, 동일 조건은 재현 가능 |
| **개인정보 보호** | 생년월일은 결과 계산 후 즉시 파기, 서버 전송 없음 |
| **SEO 최적화** | Next.js SSG + 동적 메타태그 + sitemap.ts + robots.ts |
| **수익화** | Google AdSense + 쿠팡 파트너스 광고 통합 |
| **소셜 바이럴** | 카카오톡 SDK 공유 → 유입 루프 설계 |

### 기획 배경

콘텐츠 소비 패턴 분석 결과, 사용자들은 **1분 이내** 가볍게 즐길 수 있는 콘텐츠에 높은 참여율을 보입니다. 운세·성격 테스트·두뇌 게임이라는 "소셜 공유 친화적" 카테고리를 결합해, 유저가 결과를 공유하면 새 유입이 발생하는 **바이럴 루프**를 설계했습니다.

---

## ✨ 핵심 기능

### 🔮 운세 (2종)

#### 오늘의 운세 (`today-fortune`)
- 생년월일 + 이름(선택) 입력 → 5개 영역 맞춤 운세
- 총운 · 연애 · 금전 · 일/학업 · 컨디션 각 1~5점 시각화
- 오늘 추천 행동 / 피해야 할 행동 제공
- JSON 템플릿(250+개) × 톤(plain/fun/serious) × 현대 태그 조합으로 수백 가지 조합 생성

#### 1분 사주 (`saju-lite`)
- **실제 명리학 계산** 적용 (JDN 기반 년주·월주·일주 천간지지 산출)
- 오행(木火土金水) 분포 분석 → 강한 기운 / 부족한 기운 해석
- 생년월일 파싱 실패 시 시드 기반 폴백 자동 적용

### 📝 성격 테스트 (2종)

#### 단톡방 역할 유형 테스트 (`chatroom-role-test`)
- 10문항 → 8가지 유형 진단 (분위기 메이커, 읽씹 장인, 정보통 등)
- Trait 점수 집계 알고리즘으로 개인 유형 매칭

#### 회의 포지션 유형 테스트 (`work-meeting-type`)
- 10문항 → 8가지 직장 유형 진단 (리더형, 아이디어뱅크, 조율자 등)
- 동일 알고리즘, 문항·결과 데이터만 교체

> **TestRunner 설계**: 선택 → 하이라이트 → "다음" 확인 흐름으로 잘못 고른 경우 재선택 가능

### 🧠 퀴즈 (1종)

#### 1분 상식 퀴즈 (`one-minute-quiz`)
- 39개 문제 풀에서 날짜 시드로 10문항 매일 자동 선택
- 같은 날 같은 문제 → 친구와 점수 비교 가능
- 선택지 순서 시드 셔플 (정답 위치 무작위화)
- 90%+ → 천재급, 70%+ → 우등생, 50%+ → 평균 이상 등급 제공

### 🎮 게임 (3종)

#### 반응 속도 게임 (`reaction-tap`)
- 빨강→초록 색상 전환 타이밍 측정 (5라운드 평균)
- 등급: 번개 반사신경(<250ms) ~ 명상 모드(600ms+)
- 닉네임 등록 → 이 기기 상위 20명 랭킹 보드

#### 색깔 기억 게임 (`color-memory`)
- 전 세계적으로 사랑받는 **Simon Says** 방식
- 4색 버튼 시퀀스를 단계별로 기억·재현 (단계 증가)
- 등급: 초보 도전자(~4단계) ~ 천재적 기억력(12단계+)
- 닉네임 등록 → 이 기기 상위 20명 랭킹 보드

#### 숫자 기억 게임 (`number-memory`)
- **Human Benchmark** 스타일의 전 세계 인기 두뇌 게임
- 3자리 숫자부터 시작, 맞추면 1자리씩 증가
- 밀러의 마법 숫자 7±2 이론 과학 설명 포함
- 닉네임 등록 → 이 기기 상위 20명 랭킹 보드

### 🔗 공통 기능

- **카카오톡 공유**: Kakao SDK `Share.sendDefault()` → 결과 카드 공유
- **링크 복사**: `/p/[slug]` URL 공유 (개인정보 노출 방지)
- **추천 콘텐츠**: 결과 하단 시드 기반 3개 콘텐츠 자동 추천
- **SEO**: 콘텐츠별 동적 메타태그 + OG 태그 + sitemap.xml 자동 생성

---

## 🛠 기술 스택

### 프론트엔드

| 기술 | 버전 | 선택 이유 |
|------|------|-----------|
| **Next.js** | 14.2 | App Router SSG + 동적 라우팅 + 내장 SEO |
| **TypeScript** | 5.x | 엄격한 타입 안전성, 리팩토링 용이성 |
| **Tailwind CSS** | 3.4 | 유틸리티 퍼스트 → 빠른 모바일 UI 구현 |
| **React** | 18 | Hooks 기반 클라이언트 상태 관리 |

### 인프라 & 외부 서비스

| 서비스 | 용도 |
|--------|------|
| **Vercel** | 자동 CI/CD + CDN + Edge Network 배포 |
| **Kakao JavaScript SDK** | 카카오톡 결과 카드 공유 |
| **Google AdSense** | 디스플레이 광고 수익화 |
| **Coupang Partners** | 쿠팡 캐러셀 위젯 제휴 광고 |

### 주요 설계 기술

- **FNV-1a 32-bit Hash**: 생년월일 → 결정론적 시드 생성
- **Julian Day Number(JDN)**: 천간지지 일주 계산 (명리학 엔진)
- **localStorage**: 게임 리더보드 (상위 20명, 클라이언트 저장)
- **Static Generation (SSG)**: 모든 콘텐츠 페이지 정적 사전 렌더링

---

## 🏗 아키텍처 설계

### 전체 흐름

```
사용자 입력 (생년월일, 이름)
        │
        ▼
  /p/[slug] 플레이 페이지
  (입력 폼 렌더링)
        │
        ▼ URL 쿼리 파라미터로 전달
        │ ?birthdate=1990-01-15&name=홍길동
        │
  /r/[slug] 결과 페이지
        │
        ▼
  Generator (engine/generator.ts)
        │
        ├──> fortune.ts    → 오늘의 운세
        ├──> saju.ts       → 1분 사주
        │    └── saju_calc.ts (JDN + 오행 계산)
        ├──> test.ts       → 성격 테스트
        ├──> quiz.ts       → 퀴즈
        └──> game.ts       → 게임 결과
        │
        ▼
  GenerateResultOutput (공통 결과 구조)
        │
        ▼
  ResultView 컴포넌트 렌더링
  + AdSlot (AdSense/Coupang)
  + ShareButtons (Kakao/Link)
  + 추천 콘텐츠 (seedPick)
```

### 시드 기반 결정론적 개인화

서버 없이 개인화된 결과를 제공하는 핵심 메커니즘입니다.

```
생년월일 + 이름
      │
      ▼ FNV-1a Hash
  baseSeed (고정: 같은 사람은 항상 같은 값)
      │
      │ + 오늘 날짜
      ▼ FNV-1a Hash
   daySeed (변동: 매일 달라짐)
      │
      ├── seedIndex(seed, max, offset) → 0~max-1 결정론적 인덱스
      ├── seedPick(arr, seed, n, offset) → n개 중복 없이 선택
      └── seedScore(seed, max, offset) → 1~max 점수
```

**결과**: 같은 사람, 같은 날짜 → 항상 같은 결과 (친구와 비교 가능)
**결과**: 같은 사람, 다른 날짜 → 매일 다른 결과 (데일리 리텐션)

### 운세 템플릿 선택 로직

```
템플릿 풀 (250+개)
  │
  ├── area: overall / love / money / work / health / advice / caution
  ├── tone: plain / fun / serious
  └── modernTags: late / impulse_buy / kakao_mistake / meeting_comment
         │
         ▼ 톤 선택 (primary + 변주 1~2개)
  영역별 템플릿 매칭
         │
         ▼ modernTag 최소 2종 보장 (부족하면 교체)
  최종 5개 섹션 조합
```

---

## 📁 프로젝트 구조

```
fortune-hub/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── layout.tsx                   # 루트 레이아웃 (Header, Footer, AdSense 초기화)
│   │   ├── page.tsx                     # 홈 (카테고리별 콘텐츠 카드)
│   │   ├── globals.css                  # 전역 스타일
│   │   ├── robots.ts                    # robots.txt 동적 생성
│   │   ├── sitemap.ts                   # sitemap.xml 동적 생성
│   │   ├── error.tsx                    # 에러 바운더리
│   │   ├── not-found.tsx               # 404 페이지
│   │   ├── p/[slug]/page.tsx           # 콘텐츠 플레이 (입력 폼)
│   │   ├── r/[slug]/page.tsx           # 결과 페이지 (실행 + 렌더링)
│   │   ├── c/[category]/page.tsx       # 카테고리 목록
│   │   └── legal/
│   │       ├── terms/page.tsx          # 이용약관
│   │       └── privacy/page.tsx        # 개인정보처리방침
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx              # 네비게이션 헤더
│   │   │   ├── Footer.tsx              # 푸터 (면책, 약관)
│   │   │   ├── Disclaimer.tsx          # 면책 조항
│   │   │   └── KakaoInit.tsx           # Kakao SDK 초기화 (afterInteractive)
│   │   ├── content/
│   │   │   ├── ContentCard.tsx         # 콘텐츠 카드 UI
│   │   │   ├── InputForm.tsx           # 범용 입력 폼 (date/text/select)
│   │   │   ├── ResultView.tsx          # 결과 표시 (광고 슬롯 포함)
│   │   │   ├── TestRunner.tsx          # 성격 테스트 실행기 (선택→확인 흐름)
│   │   │   ├── QuizRunner.tsx          # 퀴즈 실행기
│   │   │   ├── ReactionTapGame.tsx     # 반응 속도 게임
│   │   │   ├── ColorMemoryGame.tsx     # 색깔 기억 게임 (Simon Says)
│   │   │   └── NumberMemoryGame.tsx    # 숫자 기억 게임
│   │   ├── ad/
│   │   │   └── AdSlot.tsx              # 광고 통합 컴포넌트 (AdSense/Coupang/auto)
│   │   ├── share/
│   │   │   └── ShareButtons.tsx        # 카카오톡·링크 복사 공유
│   │   └── game/
│   │       └── GameLeaderboard.tsx     # 게임 리더보드 공유 컴포넌트
│   │
│   ├── engine/                          # 비즈니스 로직 (순수 함수)
│   │   ├── types.ts                    # 전체 타입 정의
│   │   ├── generator.ts                # 결과 생성 디스패처
│   │   ├── hash.ts                     # FNV-1a 해시 + 시드 유틸리티
│   │   ├── fortune.ts                  # 운세 생성 로직
│   │   ├── saju.ts                     # 사주 생성 (명리학 엔진 연동)
│   │   ├── saju_calc.ts               # 명리학 계산 (천간지지, 오행)
│   │   ├── test.ts                     # 성격 테스트 결과 매칭
│   │   ├── quiz.ts                     # 퀴즈 문항 선택 + 채점
│   │   ├── game.ts                     # 게임 결과 생성 (3종)
│   │   ├── personalization.ts          # 개인화 메시지 생성
│   │   └── deepResult.ts              # LLM 확장 인터페이스 (향후)
│   │
│   ├── content/                         # 콘텐츠 데이터 레이어
│   │   ├── registry.ts                 # 콘텐츠 메타데이터 + 광고 정책
│   │   ├── templates/
│   │   │   └── fortune_templates.v1.json  # 운세 템플릿 JSON (250+개)
│   │   └── questions/
│   │       ├── index.ts               # 테스트 문제 팩 로더
│   │       ├── chatroom_role.json     # 단톡방 테스트 (10문항 × 8결과)
│   │       └── work_meeting.json      # 회의 테스트 (10문항 × 8결과)
│   │
│   ├── lib/
│   │   └── utils.ts                    # 공통 유틸 함수
│   └── types/
│       └── kakao.d.ts                  # Kakao SDK 전역 타입 선언
│
├── .env.example                         # 환경변수 템플릿 (커밋됨)
├── next.config.mjs                      # Next.js 설정
├── tailwind.config.ts                   # Tailwind CSS 설정
└── tsconfig.json                        # TypeScript 설정
```

---

## ⚙️ 핵심 엔진 설계

### 결과 공통 타입 (`engine/types.ts`)

```typescript
interface GenerateResultOutput {
  resultKey: string;           // 결과 고유 키 (공유용)
  summary: string;             // 한줄 요약
  keywords: string[];          // 키워드 3개 (해시태그용)
  doToday: string;             // 오늘 추천 행동
  avoidToday: string;          // 오늘 주의사항
  detailSections: DetailSection[];  // 상세 섹션 배열
  personalDetail: string;      // 개인화 착시 한 마디
  shareCard: {                 // 공유 카드 데이터
    title: string;
    summary: string;
    keywords: string[];
  };
  meta: {
    disclaimer: boolean;       // 면책 고지 여부
    generatedAt: string;       // YYYY-MM-DD
  };
}
```

### 명리학 계산 엔진 (`engine/saju_calc.ts`)

순수 수학 공식만으로 DB 없이 실시간 사주 계산을 구현합니다.

```typescript
// Julian Day Number 기반 일주 계산
function dateToJDN(year, month, day): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153*m+2)/5) + 365*y
       + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
  // 검증: dateToJDN(2000,1,1) === 2451545
}

// 천간 (10개): 목목화화토토금금수수
const dayStem   = (JDN + 1) % 10;  // 검증: 2000-01-01 → 庚(6) ✓
const dayBranch = (JDN + 3) % 12;  // 검증: 2000-01-01 → 申(8) ✓

// 오행 분포 집계 (천간 3 + 지지 3 = 총 6개)
const elementCounts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
for (const pillar of [yearPillar, monthPillar, dayPillar]) {
  elementCounts[STEM_ELEMENT[pillar.stemIdx]]++;
  elementCounts[BRANCH_ELEMENT[pillar.branchIdx]]++;
}
```

### 광고 통합 컴포넌트 (`components/ad/AdSlot.tsx`)

```typescript
// provider 자동 결정 로직
const resolvedProvider =
  provider === 'auto'
    ? coupangWidgetId ? 'coupang' : 'adsense'  // 위젯 ID 있으면 쿠팡, 없으면 AdSense
    : provider;

// 쿠팡 iframe URL 구조 (width, height URL 파라미터 필수)
const widgetUrl =
  `https://ads-partners.coupang.com/widgets.html` +
  `?id=${coupangWidgetId}` +
  `&template=carousel` +
  `&trackingCode=${coupangPartnerId}` +
  `&subId=fortune-hub-${slot}` +
  `&width=680&height=140`;
```

---

## 🗺 라우팅 구조

```
/                          홈 (전체 콘텐츠 카드)
├── /c/[category]          카테고리 페이지
│   ├── /c/fortune         운세 목록
│   ├── /c/test            테스트 목록
│   ├── /c/quiz            퀴즈 목록
│   └── /c/game            게임 목록
│
├── /p/[slug]              콘텐츠 입력 페이지
│   ├── /p/today-fortune   운세 → 생년월일 입력
│   ├── /p/saju-lite       사주 → 생년월일 입력
│   ├── /p/chatroom-role-test   테스트 소개
│   ├── /p/work-meeting-type    테스트 소개
│   ├── /p/one-minute-quiz      퀴즈 소개
│   ├── /p/reaction-tap         게임 소개
│   ├── /p/color-memory         게임 소개
│   └── /p/number-memory        게임 소개
│
├── /r/[slug]              결과 실행 페이지
│   ├── /r/today-fortune?birthdate=...   운세 결과
│   ├── /r/saju-lite?birthdate=...       사주 결과
│   ├── /r/chatroom-role-test            테스트 실행
│   ├── /r/work-meeting-type             테스트 실행
│   ├── /r/one-minute-quiz               퀴즈 실행
│   ├── /r/reaction-tap                  게임 실행
│   ├── /r/color-memory                  게임 실행
│   └── /r/number-memory                 게임 실행
│
└── /legal/
    ├── /legal/terms       이용약관
    └── /legal/privacy     개인정보처리방침
```

**모든 라우트는 `generateStaticParams()`로 사전 생성됩니다.**
운세/사주 결과 페이지는 쿼리 파라미터(`?birthdate=`) 없으면 자동 `/p/[slug]`로 리다이렉트.

---

## 💰 수익화 구조

### 광고 정책 (`content/registry.ts` → `adPolicy`)

콘텐츠별로 광고 슬롯과 제공업체를 유연하게 설정합니다.

```typescript
// 예시: 오늘의 운세 (긴 콘텐츠, 광고 3슬롯 + 쿠팡 2개)
adPolicy: { questionAds: 0, resultSlots: ['A', 'B', 'C'], coupangCount: 2 }

// 예시: 게임 (짧은 콘텐츠, 광고 2슬롯 + 쿠팡 1개)
adPolicy: { questionAds: 0, resultSlots: ['A', 'B'], coupangCount: 1 }
```

### ResultView 슬롯 배치 전략

```
결과 상단 요약 블록
     │
 [Slot A] AdSense — 노출률 최고, CPM 최적화
     │
결과 상세 섹션 (3번째 항목 아래)
     │
 [Slot B] 쿠팡 파트너스 — 클릭 전환 유도
     │
추천 콘텐츠 위
     │
 [Slot C] AdSense or 쿠팡 (coupangCount에 따라 자동 결정)
```

### 바이럴 공유 수익 루프

```
유저가 결과 공유 (카카오톡/링크)
       │
       ▼
 새 유저 유입 (/p/slug)
       │
       ▼
 콘텐츠 플레이 → 광고 노출
       │
       ▼
 결과 공유 → 추가 유입 (루프)
```

---

## 🚀 로컬 개발 가이드

### 요구 사항

- Node.js 18.17.0 이상
- npm 9 이상

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/fortune-hub.git
cd fortune-hub

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 실제 값으로 수정

# 4. 개발 서버 실행
npm run dev
# http://localhost:3000 에서 확인
```

### 환경변수 설정 (`.env.local`)

```env
# ─── 필수 ────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ─── 선택: 카카오톡 공유 ──────────────────
# developers.kakao.com → 내 애플리케이션 → JavaScript 키
NEXT_PUBLIC_KAKAO_JS_KEY=your_kakao_js_key

# ─── 선택: Google AdSense ────────────────
# adsense.google.com → 광고 단위 만들기
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_ID=XXXXXXXXXX

# ─── 선택: 쿠팡 파트너스 ─────────────────
# partners.coupang.com → 광고 만들기 → 위젯
NEXT_PUBLIC_COUPANG_PARTNER_ID=AF0000000   # 트래킹 코드
NEXT_PUBLIC_COUPANG_WIDGET_ID=0000000      # 캐러셀 위젯 숫자 ID
```

> 광고 키 없이도 개발 가능합니다. 로컬에서는 점선 박스 플레이스홀더로 표시됩니다.

### 빌드 및 배포 테스트

```bash
npm run build    # 프로덕션 빌드
npm start        # 빌드 결과 로컬 실행
npm run lint     # ESLint 검사
```

---

## 📦 콘텐츠 확장 가이드

### 새 운세 템플릿 추가

`src/content/templates/fortune_templates.v1.json` 에 항목 추가:

```json
{
  "id": "unique-id",
  "area": "love",                          // overall|love|money|work|health|advice|caution
  "tone": "fun",                           // plain|fun|serious
  "modernTags": ["late", "impulse_buy"],   // 현대 생활 태그
  "text": "오늘 연애운은..."
}
```

### 새 성격 테스트 추가

**1단계**: `src/content/questions/new_test.json` 생성

```json
{
  "slug": "new-test",
  "questions": [
    {
      "id": "q0",
      "text": "질문 내용?",
      "options": [
        { "value": "a", "label": "선택지 A", "trait": "trait_1" },
        { "value": "b", "label": "선택지 B", "trait": "trait_2" }
      ]
    }
  ],
  "results": [
    {
      "id": "trait_1",
      "title": "유형명",
      "emoji": "🎉",
      "summary": "유형 설명",
      "traits": ["특징1", "특징2", "특징3"],
      "mistake": "주의점",
      "bestMatch": "잘 맞는 유형",
      "todayAction": "오늘 추천 행동"
    }
  ]
}
```

**2단계**: `src/content/questions/index.ts` 에 로더 추가

**3단계**: `src/content/registry.ts` 에 메타데이터 추가

```typescript
{
  slug: 'new-test',
  category: 'test',
  type: 'personality-test',
  title: '새 테스트',
  subtitle: '부제목',
  emoji: '🧩',
  inputSchema: [],
  adPolicy: { questionAds: 1, resultSlots: ['A', 'B', 'C'], coupangCount: 1 },
  questionCount: 10,
  resultCount: 8,
}
```

### 새 게임 추가

**1단계**: `src/components/content/NewGame.tsx` 구현 (`GameLeaderboard` 컴포넌트 활용)

**2단계**: `src/engine/game.ts` 에 결과 생성 함수 추가

**3단계**: `src/content/registry.ts` 에 등록

**4단계**: `src/app/r/[slug]/page.tsx` 의 `gameComponents` 맵에 추가

---

## 🚢 배포

### Vercel 자동 배포

`main` 브랜치에 push하면 Vercel이 자동으로 빌드·배포합니다.

```bash
git push origin main
# → Vercel 빌드 시작 (~1분) → 자동 배포
```

### Vercel 환경변수 설정

Vercel 대시보드 → Settings → Environment Variables:

| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_SITE_URL` | 배포된 도메인 (https://...) |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | 카카오 JavaScript 키 |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | AdSense 게시자 ID |
| `NEXT_PUBLIC_ADSENSE_SLOT_ID` | AdSense 광고 단위 ID |
| `NEXT_PUBLIC_COUPANG_PARTNER_ID` | 쿠팡 트래킹 코드 (AF...) |
| `NEXT_PUBLIC_COUPANG_WIDGET_ID` | 쿠팡 캐러셀 위젯 숫자 ID |

### 배포 전 체크리스트

- [ ] `npm run build` 로컬 빌드 성공 확인
- [ ] Vercel 환경변수 모두 설정
- [ ] `NEXT_PUBLIC_SITE_URL` 실제 도메인으로 변경
- [ ] 카카오 개발자 콘솔 → 플랫폼 → Web → 도메인 등록
- [ ] AdSense 사이트 심사 승인 확인
- [ ] 쿠팡 파트너스 위젯 ID 발급 및 등록

---

## 🔮 향후 로드맵

### 단기 (콘텐츠 확장)

- [ ] 추가 성격 테스트 (MBTI 유형, 사랑 언어 테스트 등)
- [ ] 운세 템플릿 확대 (500개+)
- [ ] 국가별 기념일 퀴즈 추가

### 중기 (기능 고도화)

- [ ] Google Analytics 연동 (콘텐츠별 CTR, 공유율 분석)
- [ ] PWA 지원 (홈 화면 추가, 오프라인 접근)
- [ ] Web Push 알림 (일일 운세 구독)
- [ ] 게임 글로벌 리더보드 (Supabase 연동)

### 장기 (수익 모델 고도화)

- [ ] **Deep Result** — LLM(Claude/GPT) API 기반 심층 개인화 분석
  *(리워드 광고 시청 1회 → 1회 열람, 또는 월 구독)*
- [ ] 인앱 결제 (광고 제거, 프리미엄 운세)
- [ ] B2B 화이트라벨 (기업 SNS용 성격 테스트 납품)

---

## 📜 라이선스

MIT License © 2026

이 프로젝트는 MIT 라이선스 하에 자유롭게 사용, 수정, 배포할 수 있습니다.

---

## 🙋 문의 및 기여

버그 리포트나 기능 제안은 [GitHub Issues](https://github.com/your-username/fortune-hub/issues)를 이용해 주세요.

Pull Request는 언제나 환영합니다.

---

<div align="center">

**소확잼** — 소소하지만 확실한 재미 🎉

[라이브 데모](https://fortune-hub-phi.vercel.app/) · [이슈 트래커](https://github.com/your-username/fortune-hub/issues)

</div>
