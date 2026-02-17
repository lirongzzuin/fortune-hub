import {
  ContentInput,
  GenerateResultOutput,
  SeedContext,
  DetailSection,
} from './types';
import { seedIndex, seedPick, seedScore } from './hash';
import { generatePersonalDetail } from './personalization';

// 흐름 유형
const FLOW_TYPES = [
  { id: 'rising', label: '상승기', emoji: '📈', desc: '새로운 기회가 다가오고 있다' },
  { id: 'stable', label: '정체기', emoji: '⏸️', desc: '지금은 내면을 돌보는 시간이다' },
  { id: 'settling', label: '정리기', emoji: '🔄', desc: '묵은 것을 정리하고 새 판을 준비하는 시기다' },
];

// 은유 기운
const ENERGY_TYPES = [
  { id: 'fire', label: '불(火)', emoji: '🔥', traits: ['열정', '추진력', '리더십'], desc: '적극적으로 나서는 에너지가 강하다' },
  { id: 'water', label: '물(水)', emoji: '💧', traits: ['유연함', '직관', '감성'], desc: '흐름을 읽고 유연하게 대처하는 힘이 있다' },
  { id: 'wind', label: '바람(風)', emoji: '🌬️', traits: ['소통', '변화', '자유'], desc: '새로운 만남과 정보가 기회를 만든다' },
  { id: 'earth', label: '흙(土)', emoji: '🌍', traits: ['안정', '인내', '성실'], desc: '묵묵히 기반을 다지는 것이 결실로 이어진다' },
];

// 균형 키워드
const BALANCE_KEYWORDS = [
  { keyword: '소통', advice: '주변 사람들과의 대화에서 실마리를 찾을 수 있다.' },
  { keyword: '절제', advice: '하고 싶은 것을 조금 참으면 더 좋은 타이밍이 온다.' },
  { keyword: '도전', advice: '익숙한 것에서 한 발짝 벗어나보는 것이 좋다.' },
  { keyword: '회복', advice: '무리하지 말고 컨디션 관리에 신경 쓰자.' },
  { keyword: '집중', advice: '여러 가지보다 한 가지에 에너지를 모으는 게 효과적이다.' },
  { keyword: '여유', advice: '조급해하지 않아도 된다. 흐름이 올 때까지 기다리자.' },
  { keyword: '감사', advice: '당연하게 여기던 것들에 감사하면 기운이 돌아온다.' },
  { keyword: '정리', advice: '안 쓰는 물건이나 미뤄둔 일을 정리하면 막힌 운이 트인다.' },
];

// 현대적 조언
const MODERN_ADVICES = [
  '카톡 프로필을 바꾸면 기운이 새로워질 수 있다.',
  '점심 메뉴를 평소와 다르게 바꿔보면 작은 변화가 생긴다.',
  '오늘은 SNS를 잠시 멀리하고 자신에게 집중하자.',
  '통장 잔고를 한 번 확인해보는 것도 좋은 루틴이다.',
  '미뤄둔 정리(책상, 옷장, 핸드폰 앨범)를 하면 마음이 개운해진다.',
  '오래 연락 안 한 친구에게 메시지를 보내면 좋은 일이 생길 수 있다.',
];

const MODERN_CAUTIONS = [
  '충동적인 온라인 쇼핑은 오늘 피하는 게 좋다.',
  '회의에서 즉흥 발언보다는 한 템포 쉬고 말하자.',
  '카톡에서 감정적인 답장은 보내기 전에 한 번 더 읽자.',
  '오늘은 지각할 확률이 높으니 알람을 하나 더 맞추자.',
  '검증 안 된 정보를 무작정 공유하지 말자.',
  '약속 시간을 다시 확인하고, 여유 있게 출발하자.',
];

export function generateSaju(
  input: ContentInput,
  seed: SeedContext,
): GenerateResultOutput {
  // 기본 흐름은 baseSeed로 고정
  const flowIdx = seedIndex(seed.baseSeed, FLOW_TYPES.length, 10);
  const flow = FLOW_TYPES[flowIdx];

  // 은유 기운도 baseSeed 기반
  const energyIdx = seedIndex(seed.baseSeed, ENERGY_TYPES.length, 20);
  const energy = ENERGY_TYPES[energyIdx];

  // 균형 키워드는 daySeed로 변주
  const balanceItems = seedPick(BALANCE_KEYWORDS, seed.daySeed, 2, 30);

  // 현대적 조언/주의도 daySeed
  const adviceIdx = seedIndex(seed.daySeed, MODERN_ADVICES.length, 40);
  const cautionIdx = seedIndex(seed.daySeed, MODERN_CAUTIONS.length, 50);

  const detailSections: DetailSection[] = [
    {
      area: 'flow',
      label: `현재 흐름: ${flow.label}`,
      emoji: flow.emoji,
      text: flow.desc,
      score: seedScore(seed.daySeed, 5, 60),
    },
    {
      area: 'energy',
      label: `기운: ${energy.label}`,
      emoji: energy.emoji,
      text: energy.desc,
      score: seedScore(seed.daySeed, 5, 70),
    },
    {
      area: 'balance1',
      label: `핵심 키워드: ${balanceItems[0].keyword}`,
      emoji: '🎯',
      text: balanceItems[0].advice,
      score: seedScore(seed.daySeed, 5, 80),
    },
    {
      area: 'balance2',
      label: `보조 키워드: ${balanceItems[1].keyword}`,
      emoji: '🔑',
      text: balanceItems[1].advice,
      score: seedScore(seed.daySeed, 5, 90),
    },
  ];

  const keywords = [flow.label, energy.label, balanceItems[0].keyword];

  const personalDetail = generatePersonalDetail(
    input.birthdate as string | undefined,
    input.name as string | undefined,
  );

  const summary = `${flow.label}의 시기, ${energy.label} 기운이 함께한다.`;

  return {
    resultKey: `saju-${seed.baseSeed}-${seed.dateStr}`,
    summary,
    keywords,
    doToday: MODERN_ADVICES[adviceIdx],
    avoidToday: MODERN_CAUTIONS[cautionIdx],
    detailSections,
    personalDetail,
    shareCard: {
      title: '1분 사주',
      summary,
      keywords,
    },
    meta: {
      disclaimer: true,
      generatedAt: seed.dateStr,
    },
  };
}
