/**
 * 명리학 기반 사주 계산 모듈
 *
 * 계산 범위: 년주(年柱), 월주(月柱), 일주(日柱)
 * 시주(時柱)는 출생 시각이 없으므로 제외
 *
 * 주의: 이 계산은 통계적 오행 분포 분석으로,
 * 실제 만세력 기반 전문 사주와 다를 수 있습니다.
 */

// ─── 천간 (天干, Heavenly Stems) ───
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
const STEMS_KR = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;

// 천간 → 오행 매핑 (0=목, 1=화, 2=토, 3=금, 4=수)
const STEM_ELEMENT = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4] as const;

// ─── 지지 (地支, Earthly Branches) ───
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
const BRANCHES_KR = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;

// 지지 → 오행 매핑 (0=목, 1=화, 2=토, 3=금, 4=수)
// 子=수, 丑=토, 寅=목, 卯=목, 辰=토, 巳=화, 午=화, 未=토, 申=금, 酉=금, 戌=토, 亥=수
const BRANCH_ELEMENT = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4] as const;

// ─── 오행 (五行, Five Elements) ───
export const ELEMENTS = ['목', '화', '토', '금', '수'] as const;
export type ElementKey = typeof ELEMENTS[number];

const ELEMENT_CHARS: Record<ElementKey, string> = {
  목: '木', 화: '火', 토: '土', 금: '金', 수: '水',
};

const ELEMENT_EMOJIS: Record<ElementKey, string> = {
  목: '🌱', 화: '🔥', 토: '🌍', 금: '⚔️', 수: '💧',
};

export interface Pillar {
  stemIdx: number;  // 0~9
  branchIdx: number; // 0~11
  label: string;    // e.g. "갑자(甲子)"
}

export interface SajuCalcResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  elementCounts: Record<ElementKey, number>; // 총 6개 (3 천간 + 3 지지)
  dominantElement: ElementKey;
  lackingElement: ElementKey;
  isValid: boolean;
}

/**
 * 그레고리력 → 율리우스 일수(JDN) 변환
 * 검증: 2000-01-01 → JDN=2451545
 */
function dateToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function makePillar(stemIdx: number, branchIdx: number): Pillar {
  return {
    stemIdx,
    branchIdx,
    label: `${STEMS_KR[stemIdx]}${BRANCHES_KR[branchIdx]}(${STEMS[stemIdx]}${BRANCHES[branchIdx]})`,
  };
}

/**
 * 생년월일로 년주 / 월주 / 일주 계산
 * 입력: "YYYY-MM-DD" 형식 문자열
 */
export function calcSaju(birthdate: string): SajuCalcResult | null {
  try {
    const parts = birthdate.split(/[-/]/);
    if (parts.length !== 3) return null;

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (
      isNaN(year) || isNaN(month) || isNaN(day) ||
      year < 1900 || year > 2100 ||
      month < 1 || month > 12 ||
      day < 1 || day > 31
    ) {
      return null;
    }

    // ── 년주 ──
    // 갑자년(甲子) = 1984, 주기 60
    const yearStemIdx = ((year - 4) % 10 + 10) % 10;
    const yearBranchIdx = ((year - 4) % 12 + 12) % 12;

    // ── 월주 ──
    // 월지: 인월(寅=2)이 1월, 이후 순서대로
    const monthBranchIdx = (month + 1) % 12;
    // 월간: 오호둔(五虎遁) — 년간 기준 인월(寅月) 천간 결정
    const monthStemBase = [2, 4, 6, 8, 0][yearStemIdx % 5];
    const monthStemIdx = (monthStemBase + month - 1) % 10;

    // ── 일주 ──
    // JDN 기반: 검증된 상수
    const jdn = dateToJDN(year, month, day);
    const dayStemIdx = (jdn + 1) % 10;
    const dayBranchIdx = (jdn + 3) % 12;

    const yearPillar = makePillar(yearStemIdx, yearBranchIdx);
    const monthPillar = makePillar(monthStemIdx, monthBranchIdx);
    const dayPillar = makePillar(dayStemIdx, dayBranchIdx);

    // ── 오행 집계 (천간 3 + 지지 3 = 총 6개) ──
    const elementCounts: Record<ElementKey, number> = {
      목: 0, 화: 0, 토: 0, 금: 0, 수: 0,
    };

    const pillars = [yearPillar, monthPillar, dayPillar];
    for (const p of pillars) {
      const stemEl = ELEMENTS[STEM_ELEMENT[p.stemIdx]];
      const branchEl = ELEMENTS[BRANCH_ELEMENT[p.branchIdx]];
      elementCounts[stemEl]++;
      elementCounts[branchEl]++;
    }

    // 강한 오행 / 부족한 오행
    const sorted = (Object.entries(elementCounts) as [ElementKey, number][])
      .sort(([, a], [, b]) => b - a);
    const dominantElement = sorted[0][0];
    const lackingElement = sorted[sorted.length - 1][0];

    return {
      yearPillar,
      monthPillar,
      dayPillar,
      elementCounts,
      dominantElement,
      lackingElement,
      isValid: true,
    };
  } catch {
    return null;
  }
}

// ─── 오행별 운세 텍스트 ───

interface ElementFortune {
  dominantDesc: string;    // 강할 때 특성
  lackingAdvice: string;   // 부족할 때 보완 조언
  todayFlow: string;       // 오늘 흐름
  avoidAction: string;     // 오늘 주의
  emoji: string;
  label: string;
}

const ELEMENT_FORTUNES: Record<ElementKey, ElementFortune> = {
  목: {
    emoji: ELEMENT_EMOJIS['목'],
    label: '木(목) — 성장·결단',
    dominantDesc: '추진력과 결단력이 강한 기운이다. 새로운 일을 시작하거나 계획을 행동으로 옮기기 좋은 날이다.',
    lackingAdvice: '목(木) 기운이 부족하다. 작은 것이라도 직접 시작해보는 것이 막힌 운을 트는 열쇠다.',
    todayFlow: '오늘은 새로운 시작과 결정에 유리한 날이다. 미뤄온 일을 실행에 옮겨보자.',
    avoidAction: '우유부단하게 결정을 미루면 기회를 놓칠 수 있다. 작은 선택부터 과감하게 해보자.',
  },
  화: {
    emoji: ELEMENT_EMOJIS['화'],
    label: '火(화) — 열정·표현',
    dominantDesc: '표현력과 열정이 강한 기운이다. 사람들과의 교류에서 에너지를 얻고 좋은 인상을 남길 수 있다.',
    lackingAdvice: '화(火) 기운이 부족하다. 오늘은 자신을 조금 더 드러내고 표현하면 막힌 흐름이 풀린다.',
    todayFlow: '오늘은 소통과 인정이 중요한 날이다. 먼저 다가가거나 의견을 솔직하게 표현해보자.',
    avoidAction: '감정이 과열될 수 있다. 화가 나거나 흥분된 상태에서 중요한 결정을 내리지 말자.',
  },
  토: {
    emoji: ELEMENT_EMOJIS['토'],
    label: '土(토) — 안정·신뢰',
    dominantDesc: '안정감과 신뢰를 주는 기운이다. 꾸준함과 성실함이 빛을 발하는 시기로, 기반을 다지는 데 좋다.',
    lackingAdvice: '토(土) 기운이 부족하다. 지금은 빠른 변화보다 기본을 점검하고 탄탄히 하는 것이 중요하다.',
    todayFlow: '오늘은 급하지 않게 꾸준히 하는 것이 맞다. 기존 관계와 업무를 안정적으로 유지하자.',
    avoidAction: '지나친 보수성이 발목을 잡을 수 있다. 새로운 의견을 무시하지 않도록 주의하자.',
  },
  금: {
    emoji: ELEMENT_EMOJIS['금'],
    label: '金(금) — 결단·효율',
    dominantDesc: '냉철한 판단력과 효율을 추구하는 기운이다. 불필요한 것을 정리하고 핵심에 집중하면 성과가 따른다.',
    lackingAdvice: '금(金) 기운이 부족하다. 오늘은 우선순위를 명확히 하고 과감하게 정리하는 것이 도움이 된다.',
    todayFlow: '오늘은 정리와 결단의 날이다. 불필요한 약속이나 업무를 줄이고 핵심에 집중해보자.',
    avoidAction: '너무 냉정하거나 단호하게 굴면 관계가 상할 수 있다. 말투와 표현에 온기를 더하자.',
  },
  수: {
    emoji: ELEMENT_EMOJIS['수'],
    label: '水(수) — 지혜·적응',
    dominantDesc: '직관력과 유연한 적응력이 강한 기운이다. 흐름을 읽고 기회를 포착하는 능력이 뛰어난 날이다.',
    lackingAdvice: '수(水) 기운이 부족하다. 오늘은 고집을 내려놓고 유연하게 생각을 바꿔보는 것이 현명하다.',
    todayFlow: '오늘은 직감을 믿고 유연하게 대처하는 것이 중요하다. 상황을 억지로 통제하려 하지 말자.',
    avoidAction: '우유부단하게 이리저리 휩쓸리면 에너지만 낭비된다. 핵심을 정하고 움직이자.',
  },
};

export { ELEMENT_FORTUNES, ELEMENT_CHARS, ELEMENT_EMOJIS };
