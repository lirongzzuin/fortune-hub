import {
  FortuneTemplate,
  FortuneArea,
  FortuneTone,
  ModernTag,
  ContentInput,
  GenerateResultOutput,
  SeedContext,
  DetailSection,
} from './types';
import { seedIndex, seedPick, seedScore } from './hash';
import { generatePersonalDetail } from './personalization';
import templatesData from '../content/templates/fortune_templates.v1.json';

const templates: FortuneTemplate[] = templatesData.templates as FortuneTemplate[];

const AREA_CONFIG: { area: FortuneArea; label: string; emoji: string }[] = [
  { area: 'overall', label: '총운', emoji: '🌟' },
  { area: 'love', label: '연애', emoji: '💕' },
  { area: 'money', label: '금전', emoji: '💰' },
  { area: 'work', label: '일/학업', emoji: '💼' },
  { area: 'health', label: '컨디션', emoji: '🏃' },
];

const KEYWORD_POOL = [
  '새로운 시작', '여유', '집중', '소통', '절제', '도전', '회복',
  '기다림', '변화', '성장', '균형', '결실', '정리', '관계',
  '에너지', '직감', '인내', '감사', '계획', '실행',
];

/**
 * 톤 선택: 기본 톤 1개 + 변주 톤 1~2개
 */
function selectTones(seed: SeedContext, preferredTone?: FortuneTone): { primary: FortuneTone; variations: FortuneTone[] } {
  const tones: FortuneTone[] = ['plain', 'fun', 'serious'];
  const primary = preferredTone || tones[seedIndex(seed.baseSeed, 3, 100)];
  const otherTones = tones.filter(t => t !== primary);
  // 1~2개 섹션에 다른 톤 적용
  const variationCount = seedIndex(seed.daySeed, 2, 200) + 1; // 1 or 2
  const variations = seedPick(otherTones, seed.daySeed, variationCount, 300);
  return { primary, variations };
}

/**
 * 특정 area + tone 조합에서 템플릿 선택
 */
function pickTemplate(
  area: FortuneArea,
  tone: FortuneTone,
  seed: number,
  offset: number,
  usedIds: Set<string>,
): FortuneTemplate | null {
  const candidates = templates.filter(
    t => t.area === area && t.tone === tone && !usedIds.has(t.id)
  );
  if (candidates.length === 0) {
    // 톤 제약 완화
    const fallback = templates.filter(t => t.area === area && !usedIds.has(t.id));
    if (fallback.length === 0) return null;
    const idx = seedIndex(seed, fallback.length, offset);
    return fallback[idx];
  }
  const idx = seedIndex(seed, candidates.length, offset);
  return candidates[idx];
}

/**
 * modernTag가 결과 전체에서 최소 2종 이상 등장하도록 보장
 */
function ensureModernTags(
  selected: FortuneTemplate[],
  seed: SeedContext,
  usedIds: Set<string>,
): FortuneTemplate[] {
  const tagSet = new Set<ModernTag>();
  selected.forEach(t => t.modernTags.forEach(tag => tagSet.add(tag)));

  if (tagSet.size >= 2) return selected;

  // 부족한 태그 보충: 아직 없는 태그를 가진 템플릿으로 교체
  const allTags: ModernTag[] = ['late', 'impulse_buy', 'kakao_mistake', 'meeting_comment'];
  const missingTags = allTags.filter(t => !tagSet.has(t));

  for (const missingTag of missingTags) {
    if (tagSet.size >= 2) break;

    // 교체 가능한 슬롯 찾기 (overall은 보존)
    for (let i = 1; i < selected.length; i++) {
      const current = selected[i];
      const replacements = templates.filter(
        t => t.area === current.area &&
          t.modernTags.includes(missingTag) &&
          !usedIds.has(t.id)
      );
      if (replacements.length > 0) {
        const idx = seedIndex(seed.daySeed, replacements.length, 500 + i);
        usedIds.delete(current.id);
        selected[i] = replacements[idx];
        usedIds.add(replacements[idx].id);
        tagSet.add(missingTag);
        break;
      }
    }
  }

  return selected;
}

export function generateFortune(
  input: ContentInput,
  seed: SeedContext,
  preferredTone?: FortuneTone,
): GenerateResultOutput {
  const { primary, variations } = selectTones(seed, preferredTone);
  const usedIds = new Set<string>();

  // 각 영역별 템플릿 선택
  const selectedTemplates: FortuneTemplate[] = [];

  AREA_CONFIG.forEach((config, i) => {
    // 일부 섹션에 변주 톤 적용
    const tone = i > 0 && i <= variations.length ? variations[i - 1] : primary;
    const template = pickTemplate(config.area, tone, seed.daySeed, i * 100, usedIds);
    if (template) {
      usedIds.add(template.id);
      selectedTemplates.push(template);
    }
  });

  // advice (doToday)
  const adviceTemplate = pickTemplate('advice', primary, seed.daySeed, 600, usedIds);
  if (adviceTemplate) {
    usedIds.add(adviceTemplate.id);
  }

  // caution (avoidToday)
  const cautionTemplate = pickTemplate('caution', primary, seed.daySeed, 700, usedIds);
  if (cautionTemplate) {
    usedIds.add(cautionTemplate.id);
  }

  // modernTag 최소 2종 보장
  ensureModernTags(selectedTemplates, seed, usedIds);

  // detailSections 생성
  const detailSections: DetailSection[] = selectedTemplates.map((t, i) => {
    const config = AREA_CONFIG[i];
    return {
      area: config?.area || t.area,
      label: config?.label || t.area,
      emoji: config?.emoji || '✨',
      text: t.text,
      score: seedScore(seed.daySeed, 5, i * 50 + 10),
    };
  });

  // 키워드 3개 선택
  const keywords = seedPick(KEYWORD_POOL, seed.daySeed, 3, 800);

  // 개인화 디테일
  const personalDetail = generatePersonalDetail(
    input.birthdate as string | undefined,
    input.name as string | undefined,
  );

  // 총운 요약 (overall 템플릿의 첫 문장 기반)
  const overallText = selectedTemplates[0]?.text || '오늘은 차분한 하루가 될 전망이다.';
  const summaryText = overallText.length > 40
    ? overallText.slice(0, 40).replace(/[.,]?\s*$/, '') + '.'
    : overallText;

  return {
    resultKey: `fortune-${seed.baseSeed}-${seed.dateStr}`,
    summary: summaryText,
    keywords,
    doToday: adviceTemplate?.text || '작은 친절을 베풀어보자.',
    avoidToday: cautionTemplate?.text || '급한 결정은 잠시 미루자.',
    detailSections,
    personalDetail,
    shareCard: {
      title: '오늘의 운세',
      summary: summaryText,
      keywords,
    },
    meta: {
      disclaimer: true,
      generatedAt: seed.dateStr,
    },
  };
}
