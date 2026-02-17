import { type ClassValue, clsx } from 'clsx';

/**
 * 간단한 className 합치기 (clsx 없이도 동작)
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

/**
 * 날짜를 YYYY-MM-DD 형식으로
 */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * 오늘 날짜 YYYY-MM-DD
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * 한국어 날짜 표시
 */
export function formatKoreanDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
}

/**
 * URL 쿼리 파라미터를 객체로
 */
export function parseSearchParams(params: Record<string, string | string[] | undefined>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') {
      result[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      result[key] = value[0];
    }
  }
  return result;
}

/**
 * 결과 공유 URL 생성
 */
export function buildShareUrl(slug: string, params: Record<string, string>): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const searchParams = new URLSearchParams(params);
  return `${base}/r/${slug}?${searchParams.toString()}`;
}

/**
 * 카테고리 한국어 라벨
 */
export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    fortune: '운세',
    test: '테스트',
    quiz: '퀴즈',
    game: '게임',
  };
  return labels[category] || category;
}
