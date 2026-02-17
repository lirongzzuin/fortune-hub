// ─── Content Registry Types ───

export type ContentCategory = 'fortune' | 'test' | 'quiz' | 'game';
export type ContentType = 'fortune' | 'saju' | 'personality-test' | 'quiz' | 'game';
export type AdProvider = 'adsense' | 'coupang' | 'none';
export type AdSlotPosition = 'A' | 'B' | 'C';

export interface InputField {
  key: string;
  label: string;
  type: 'date' | 'text' | 'select' | 'number';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export interface AdPolicy {
  questionAds: number; // 0 or 1 for quiz/test pages
  resultSlots: AdSlotPosition[];
  coupangCount: number; // 0~3
}

export interface ContentEntry {
  slug: string;
  category: ContentCategory;
  type: ContentType;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  emoji: string;
  inputSchema: InputField[];
  adPolicy: AdPolicy;
  questionCount?: number; // for test/quiz
  resultCount?: number; // for personality test
}

// ─── Engine Output Types ───

export interface DetailSection {
  area: string;
  label: string;
  emoji: string;
  text: string;
  score?: number; // 1~5 for visual gauge
}

export interface GenerateResultOutput {
  resultKey: string;
  summary: string;
  keywords: string[];
  doToday: string;
  avoidToday: string;
  detailSections: DetailSection[];
  personalDetail: string; // 개인화 착시 1문장
  shareCard: {
    title: string;
    summary: string;
    keywords: string[];
  };
  meta: {
    disclaimer: boolean;
    generatedAt: string;
  };
}

// ─── Seed Context ───

export interface SeedContext {
  baseSeed: number;
  daySeed: number;
  dateStr: string; // YYYY-MM-DD
}

export interface ContentInput {
  [key: string]: string | number | undefined;
  birthdate?: string;
  name?: string;
}

// ─── Test/Quiz Types ───

export interface QuestionOption {
  value: string;
  label: string;
  trait?: string; // for personality test scoring
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface QuestionPack {
  slug: string;
  questions: Question[];
  results: TestResult[];
}

export interface TestResult {
  id: string;
  title: string;
  emoji: string;
  summary: string;
  traits: string[];
  mistake: string;
  bestMatch: string;
  todayAction: string;
}

// ─── Fortune Template Types ───

export type FortuneArea = 'overall' | 'love' | 'money' | 'work' | 'health' | 'advice' | 'caution';
export type FortuneTone = 'plain' | 'fun' | 'serious';
export type ModernTag = 'late' | 'impulse_buy' | 'kakao_mistake' | 'meeting_comment';

export interface FortuneTemplate {
  id: string;
  area: FortuneArea;
  tone: FortuneTone;
  modernTags: ModernTag[];
  text: string;
}

export interface FortuneTemplateFile {
  version: string;
  areas: FortuneArea[];
  tones: FortuneTone[];
  modernTags: ModernTag[];
  templates: FortuneTemplate[];
}

// ─── LLM Extension Interface (future) ───

export interface DeepResultInput {
  content: ContentEntry;
  input: ContentInput;
}

/**
 * LLM 확장 인터페이스 (향후 구현 예정)
 * - 현재는 Not implemented 상태
 * - 추후 유료/리워드 사용자에게만 호출 가능하도록 설계
 * - LLM API 호출로 더 깊은 개인화 결과 제공
 */
export interface DeepResultOutput extends GenerateResultOutput {
  deepInsight: string;
  isDeep: true;
}
