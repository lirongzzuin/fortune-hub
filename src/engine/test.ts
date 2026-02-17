import {
  ContentInput,
  GenerateResultOutput,
  QuestionPack,
} from './types';
import { generatePersonalDetail } from './personalization';

/**
 * 성격/유형 테스트 결과 생성
 * - 답변 기반으로 trait 점수 집계
 * - 최고 점수 결과 선택
 */
export function generateTestResult(
  input: ContentInput,
  answers: Record<string, string>,
  questionPack: QuestionPack,
): GenerateResultOutput {
  // trait별 점수 집계
  const traitScores: Record<string, number> = {};

  questionPack.questions.forEach((q) => {
    const answer = answers[q.id];
    if (!answer) return;
    const option = q.options.find(o => o.value === answer);
    if (option?.trait) {
      traitScores[option.trait] = (traitScores[option.trait] || 0) + 1;
    }
  });

  // 점수 순 정렬
  const sortedTraits = Object.entries(traitScores)
    .sort(([, a], [, b]) => b - a);

  // 상위 trait로 결과 매칭
  const topTrait = sortedTraits[0]?.[0] || questionPack.results[0].id;
  const result = questionPack.results.find(r => r.id === topTrait) || questionPack.results[0];

  // 상위 2개 trait
  const topTraits = sortedTraits.slice(0, 2).map(([t]) => t);

  const personalDetail = generatePersonalDetail(
    input.birthdate as string | undefined,
    input.name as string | undefined,
    topTraits,
  );

  return {
    resultKey: `test-${questionPack.slug}-${result.id}`,
    summary: result.summary,
    keywords: result.traits.slice(0, 3),
    doToday: result.todayAction,
    avoidToday: result.mistake,
    detailSections: [
      {
        area: 'type',
        label: result.title,
        emoji: result.emoji,
        text: result.summary,
      },
      {
        area: 'traits',
        label: '주요 특징',
        emoji: '📋',
        text: result.traits.join(', '),
      },
      {
        area: 'mistake',
        label: '주의할 점',
        emoji: '⚠️',
        text: result.mistake,
      },
      {
        area: 'match',
        label: '잘 맞는 상대',
        emoji: '🤝',
        text: result.bestMatch,
      },
      {
        area: 'action',
        label: '오늘 추천 행동',
        emoji: '✅',
        text: result.todayAction,
      },
    ],
    personalDetail,
    shareCard: {
      title: `나의 유형: ${result.title}`,
      summary: result.summary,
      keywords: result.traits.slice(0, 3),
    },
    meta: {
      disclaimer: true,
      generatedAt: new Date().toISOString().slice(0, 10),
    },
  };
}
