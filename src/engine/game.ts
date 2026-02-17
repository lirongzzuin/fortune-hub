import { GenerateResultOutput } from './types';

/**
 * 반응 속도 게임 결과 생성
 */
export function generateGameResult(
  avgReactionMs: number,
  taps: number,
  bestMs: number,
): GenerateResultOutput {
  let grade: string;
  let comment: string;

  if (avgReactionMs < 250) {
    grade = '번개 반사신경';
    comment = '프로 게이머급 반응 속도다. 오늘 컨디션이 좋은 모양이다.';
  } else if (avgReactionMs < 350) {
    grade = '날렵한 편';
    comment = '평균 이상의 반응 속도다. 집중력이 잘 유지되고 있다.';
  } else if (avgReactionMs < 450) {
    grade = '보통';
    comment = '무난한 반응 속도다. 가벼운 스트레칭 후 다시 도전해보자.';
  } else if (avgReactionMs < 600) {
    grade = '느긋한 타입';
    comment = '여유로운 리듬이다. 급하지 않은 게 장점일 수도 있다.';
  } else {
    grade = '명상 모드';
    comment = '마음이 편안한 상태다. 속도보다 정확도가 중요할 때도 있다.';
  }

  return {
    resultKey: `game-reaction-${avgReactionMs}`,
    summary: `평균 반응 속도 ${avgReactionMs}ms - ${grade}`,
    keywords: [grade, `${avgReactionMs}ms`, '반응게임'],
    doToday: '손가락 스트레칭을 해보자.',
    avoidToday: '무리한 게임 연속 플레이는 자제하자.',
    detailSections: [
      {
        area: 'avg',
        label: '평균 반응 속도',
        emoji: '⚡',
        text: `${avgReactionMs}ms`,
        score: avgReactionMs < 300 ? 5 : avgReactionMs < 400 ? 4 : avgReactionMs < 500 ? 3 : 2,
      },
      {
        area: 'best',
        label: '최고 기록',
        emoji: '🏆',
        text: `${bestMs}ms`,
      },
      {
        area: 'taps',
        label: '총 탭 횟수',
        emoji: '👆',
        text: `${taps}회`,
      },
      {
        area: 'grade',
        label: '등급',
        emoji: '🏅',
        text: `${grade} - ${comment}`,
      },
    ],
    personalDetail: '반응 속도는 컨디션에 따라 매일 달라진다. 내일 다시 도전해보자.',
    shareCard: {
      title: '반응 속도 게임',
      summary: `평균 ${avgReactionMs}ms - ${grade}`,
      keywords: [grade, `${avgReactionMs}ms`, '반응게임'],
    },
    meta: {
      disclaimer: true,
      generatedAt: new Date().toISOString().slice(0, 10),
    },
  };
}
