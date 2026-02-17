import { fnv1aHash } from './hash';

/**
 * 개인화 착시 문장 생성
 * - 생년월일 기반: 월/계절/요일/분기
 * - 이름 기반: 글자수/초성
 * - 테스트 기반: 상위 trait 2개
 */

const SEASONS: Record<string, string> = {
  '01': '겨울', '02': '겨울', '03': '봄',
  '04': '봄', '05': '봄', '06': '여름',
  '07': '여름', '08': '여름', '09': '가을',
  '10': '가을', '11': '가을', '12': '겨울',
};

const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

const QUARTER_LABELS: Record<number, string> = {
  1: '새해의 기운을 품은',
  2: '봄의 활력을 받은',
  3: '여름의 열정을 가진',
  4: '가을의 깊이를 지닌',
};

const SEASON_TRAITS: Record<string, string[]> = {
  '봄': ['새로운 시작에 강하고', '변화를 자연스럽게 받아들이는 편이다'],
  '여름': ['에너지가 넘치고', '적극적으로 앞서 나가는 타입이다'],
  '가을': ['깊이 생각하고', '차분하게 준비하는 스타일이다'],
  '겨울': ['인내심이 있고', '묵묵히 결실을 맺는 사람이다'],
};

const NAME_LENGTH_TRAITS: Record<number, string> = {
  2: '간결하고 핵심을 짚는 성향이 강하다',
  3: '균형 잡힌 사고와 조화를 중시하는 편이다',
  4: '디테일에 강하고 꼼꼼하게 챙기는 타입이다',
};

// 한글 초성 추출
function getChosung(char: string): string {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return '';
  const chosungIndex = Math.floor(code / 588);
  const chosung = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
    'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
  ];
  return chosung[chosungIndex] || '';
}

const CHOSUNG_ENERGY: Record<string, string> = {
  'ㄱ': '시작의 힘', 'ㄴ': '부드러운 흐름', 'ㄷ': '단단한 의지',
  'ㄹ': '유연한 변화', 'ㅁ': '포용의 에너지', 'ㅂ': '밝은 기운',
  'ㅅ': '섬세한 감각', 'ㅇ': '열린 마음', 'ㅈ': '정돈된 방향',
  'ㅊ': '차분한 집중', 'ㅋ': '쾌활한 돌파', 'ㅌ': '탄탄한 기반',
  'ㅍ': '풍성한 가능성', 'ㅎ': '화합의 기운',
  'ㄲ': '강한 추진력', 'ㄸ': '뜨거운 열정', 'ㅃ': '빠른 판단력',
  'ㅆ': '날카로운 직관', 'ㅉ': '짜임새 있는 계획',
};

export function generatePersonalDetail(
  birthdate?: string,
  name?: string,
  traits?: string[],
): string {
  const parts: string[] = [];

  if (birthdate) {
    const date = new Date(birthdate);
    if (!isNaN(date.getTime())) {
      const month = birthdate.slice(5, 7);
      const season = SEASONS[month] || '봄';
      const weekday = WEEKDAY_NAMES[date.getDay()];
      const quarter = Math.ceil(parseInt(month) / 3);
      const quarterLabel = QUARTER_LABELS[quarter];
      const seasonTrait = SEASON_TRAITS[season];

      // 시드로 변형 선택
      const seed = fnv1aHash(birthdate);
      const variant = seed % 3;

      if (variant === 0) {
        parts.push(`${season}에 태어난 당신은 ${seasonTrait[0]} ${seasonTrait[1]}`);
      } else if (variant === 1) {
        parts.push(`${weekday}요일생인 당신에게는 ${quarterLabel} 에너지가 흐르고 있다.`);
      } else {
        parts.push(`${month}월생 특유의 감각이 오늘 빛을 발할 수 있다.`);
      }
    }
  }

  if (name && name.length > 0) {
    const nameLen = name.length;
    const firstChar = name[0];
    const chosung = getChosung(firstChar);

    if (parts.length === 0) {
      // 이름만 있을 때
      const lenTrait = NAME_LENGTH_TRAITS[nameLen] || NAME_LENGTH_TRAITS[3];
      const energy = chosung ? CHOSUNG_ENERGY[chosung] || '고유한 리듬' : '고유한 리듬';
      parts.push(`이름에서 '${energy}'이(가) 느껴지며, ${lenTrait}.`);
    } else {
      // 생년월일 + 이름 조합
      const energy = chosung ? CHOSUNG_ENERGY[chosung] || '고유한 리듬' : '고유한 리듬';
      parts.push(`이름의 '${energy}'이(가) 이 흐름에 힘을 더한다.`);
    }
  }

  if (traits && traits.length >= 2) {
    parts.push(`특히 '${traits[0]}'과(와) '${traits[1]}' 성향이 오늘 상황에 잘 맞는 하루다.`);
  }

  if (parts.length === 0) {
    return '오늘의 흐름이 당신에게 작은 기회를 가져다줄 수 있다.';
  }

  return parts.join(' ');
}
