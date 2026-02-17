import { GenerateResultOutput } from './types';

/**
 * 색깔 기억 게임 결과 생성
 */
export function generateColorMemoryResult(maxLevel: number): GenerateResultOutput {
  let grade: string;
  let comment: string;

  if (maxLevel >= 12) {
    grade = '천재적 기억력';
    comment = '12단계 이상은 상위 1% 수준이다. 기억력이 매우 뛰어나다.';
  } else if (maxLevel >= 9) {
    grade = '뛰어난 기억력';
    comment = '9단계 이상은 평균을 크게 웃도는 기억력이다. 대단하다!';
  } else if (maxLevel >= 7) {
    grade = '좋은 기억력';
    comment = '7단계는 꽤 좋은 수준이다. 집중력이 잘 유지되고 있다.';
  } else if (maxLevel >= 5) {
    grade = '평균 수준';
    comment = '5~6단계는 일반적인 기억력 수준이다. 연습하면 늘어난다.';
  } else {
    grade = '초보 도전자';
    comment = '처음엔 누구나 이렇다. 집중하면 금방 늘어난다!';
  }

  return {
    resultKey: `game-color-memory-${maxLevel}`,
    summary: `${maxLevel}단계 달성 — ${grade}`,
    keywords: [grade, `${maxLevel}단계`, '색깔기억'],
    doToday: '두뇌 훈련을 꾸준히 하면 기억력이 향상된다.',
    avoidToday: '멀티태스킹은 오늘 집중력을 분산시킬 수 있다.',
    detailSections: [
      {
        area: 'level',
        label: '달성 단계',
        emoji: '🎨',
        text: `${maxLevel}단계`,
        score: Math.min(5, Math.max(1, Math.floor(maxLevel / 2.5))),
      },
      {
        area: 'grade',
        label: '기억력 등급',
        emoji: '🧠',
        text: `${grade} — ${comment}`,
      },
      {
        area: 'tip',
        label: '기억력 향상 팁',
        emoji: '💡',
        text: '색깔을 보는 순간 소리로 연상하면 기억이 더 잘 된다. 예: 빨강→"탁!", 파랑→"펑!" 처럼 나만의 연상을 만들어보자.',
      },
    ],
    personalDetail: '기억력은 나이와 상관없이 훈련으로 키울 수 있다.',
    shareCard: {
      title: '색깔 기억 게임',
      summary: `${maxLevel}단계 달성 — ${grade}`,
      keywords: [grade, `${maxLevel}단계`, '색깔기억'],
    },
    meta: { disclaimer: false, generatedAt: new Date().toISOString().slice(0, 10) },
  };
}

/**
 * 숫자 기억 게임 결과 생성
 */
export function generateNumberMemoryResult(maxDigits: number): GenerateResultOutput {
  let grade: string;
  let comment: string;

  if (maxDigits >= 12) {
    grade = '포토그래픽 메모리';
    comment = '12자리 이상은 극히 드문 능력이다. 놀라운 집중력이다!';
  } else if (maxDigits >= 9) {
    grade = '천재급 기억력';
    comment = '9자리 이상은 상위 5% 수준의 기억력이다.';
  } else if (maxDigits >= 7) {
    grade = '우수한 기억력';
    comment = '7자리는 평균을 상회하는 좋은 기억력이다.';
  } else if (maxDigits >= 5) {
    grade = '평균 수준';
    comment = '인간의 평균 단기 기억 용량은 7±2개다. 충분히 정상이다.';
  } else {
    grade = '초보 도전자';
    comment = '긴장하지 말고 천천히 다시 도전해보자!';
  }

  return {
    resultKey: `game-number-memory-${maxDigits}`,
    summary: `${maxDigits}자리 숫자 기억 — ${grade}`,
    keywords: [grade, `${maxDigits}자리`, '숫자기억'],
    doToday: '집중이 필요한 업무나 공부를 하기 좋은 상태다.',
    avoidToday: '산만한 환경은 오늘 집중력을 더 떨어뜨릴 수 있다.',
    detailSections: [
      {
        area: 'digits',
        label: '기억한 최대 자릿수',
        emoji: '🔢',
        text: `${maxDigits}자리`,
        score: Math.min(5, Math.max(1, Math.floor(maxDigits / 2.5))),
      },
      {
        area: 'grade',
        label: '기억력 등급',
        emoji: '🧠',
        text: `${grade} — ${comment}`,
      },
      {
        area: 'science',
        label: '단기 기억의 비밀',
        emoji: '🔬',
        text: '인간의 단기 기억 용량(마법의 숫자 7±2)은 1956년 밀러의 연구로 밝혀졌다. 7자리 전화번호가 기억하기 적당한 이유가 여기 있다.',
      },
    ],
    personalDetail: '숫자를 묶어서 기억하면 더 길게 외울 수 있다. 예: 483729 → 48·37·29',
    shareCard: {
      title: '숫자 기억 게임',
      summary: `${maxDigits}자리 숫자 기억 — ${grade}`,
      keywords: [grade, `${maxDigits}자리`, '숫자기억'],
    },
    meta: { disclaimer: false, generatedAt: new Date().toISOString().slice(0, 10) },
  };
}

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
