import { SeedContext } from './types';

/**
 * FNV-1a 32-bit hash - 빠르고 분포가 균일한 비암호화 해시
 */
export function fnv1aHash(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash;
}

/**
 * 입력값을 정규화하여 해시 생성
 * - 공백 제거, 소문자 변환, 날짜 포맷 통일
 */
export function normalizeInput(input: Record<string, unknown>): string {
  const keys = Object.keys(input).sort();
  const parts = keys
    .filter((k) => input[k] !== undefined && input[k] !== '')
    .map((k) => {
      let val = String(input[k]).trim().toLowerCase();
      // 날짜 정규화: 다양한 포맷 -> YYYYMMDD
      if (/^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/.test(val)) {
        val = val.replace(/[-/.]/g, '');
      }
      return `${k}:${val}`;
    });
  return parts.join('|');
}

/**
 * baseSeed: 입력값에서 파생, 같은 사람은 항상 같은 값
 */
export function createBaseSeed(input: Record<string, unknown>): number {
  const normalized = normalizeInput(input);
  return fnv1aHash(normalized);
}

/**
 * daySeed: baseSeed + 날짜로 파생, 매일 달라짐
 */
export function createDaySeed(baseSeed: number, dateStr: string): number {
  return fnv1aHash(`${baseSeed}|${dateStr}`);
}

/**
 * SeedContext 생성 헬퍼
 */
export function createSeedContext(
  input: Record<string, unknown>,
  dateStr?: string
): SeedContext {
  const today = dateStr || new Date().toISOString().slice(0, 10);
  const baseSeed = createBaseSeed(input);
  const daySeed = createDaySeed(baseSeed, today);
  return { baseSeed, daySeed, dateStr: today };
}

/**
 * 시드 기반 인덱스 선택 (0 ~ max-1)
 */
export function seedIndex(seed: number, max: number, offset: number = 0): number {
  const mixed = fnv1aHash(`${seed}|${offset}`);
  return mixed % max;
}

/**
 * 시드 기반으로 배열에서 n개 선택 (중복 없이)
 */
export function seedPick<T>(arr: T[], seed: number, n: number, offset: number = 0): T[] {
  if (n >= arr.length) return [...arr];
  const result: T[] = [];
  const used = new Set<number>();
  let attempt = 0;
  while (result.length < n && attempt < n * 10) {
    const idx = seedIndex(seed, arr.length, offset + attempt);
    if (!used.has(idx)) {
      used.add(idx);
      result.push(arr[idx]);
    }
    attempt++;
  }
  return result;
}

/**
 * 시드 기반 0~1 사이 float 반환
 */
export function seedFloat(seed: number, offset: number = 0): number {
  const h = fnv1aHash(`${seed}|f|${offset}`);
  return (h % 10000) / 10000;
}

/**
 * 시드 기반 1~max 사이 점수 반환
 */
export function seedScore(seed: number, max: number = 5, offset: number = 0): number {
  return (seedIndex(seed, max, offset + 999) + 1);
}
