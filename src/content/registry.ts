import { ContentEntry } from '../engine/types';

export const contentRegistry: ContentEntry[] = [
  // ─── 운세 ───
  {
    slug: 'today-fortune',
    category: 'fortune',
    type: 'fortune',
    title: '오늘의 운세',
    subtitle: '생년월일로 보는 오늘 하루',
    description: '생년월일을 입력하면 오늘의 총운, 연애, 금전, 일, 컨디션 운세를 확인할 수 있습니다. 같은 날짜에는 같은 기본 운세가 나오지만, 매일 조금씩 달라지는 조언도 함께 제공됩니다.',
    tags: ['운세', '오늘', '생년월일', '데일리'],
    emoji: '🔮',
    inputSchema: [
      { key: 'birthdate', label: '생년월일', type: 'date', required: true, placeholder: '1990-01-15' },
      { key: 'name', label: '이름 (선택)', type: 'text', required: false, placeholder: '홍길동' },
    ],
    adPolicy: { questionAds: 0, resultSlots: ['A', 'B', 'C'], coupangCount: 2 },
  },
  {
    slug: 'saju-lite',
    category: 'fortune',
    type: 'saju',
    title: '1분 사주',
    subtitle: '가볍게 보는 나의 기운과 흐름',
    description: '복잡한 만세력 없이, 생년월일만으로 현재의 흐름(상승/정체/정리)과 은유적 기운(불/물/바람/흙), 균형 키워드를 확인해보세요.',
    tags: ['사주', '기운', '흐름', '간단'],
    emoji: '☯️',
    inputSchema: [
      { key: 'birthdate', label: '생년월일', type: 'date', required: true, placeholder: '1990-01-15' },
      { key: 'name', label: '이름 (선택)', type: 'text', required: false, placeholder: '홍길동' },
    ],
    adPolicy: { questionAds: 0, resultSlots: ['A', 'B', 'C'], coupangCount: 2 },
  },

  // ─── 테스트 ───
  {
    slug: 'chatroom-role-test',
    category: 'test',
    type: 'personality-test',
    title: '단톡방 역할 유형 테스트',
    subtitle: '단톡방에서 나는 어떤 존재일까?',
    description: '10개의 질문으로 단톡방에서의 당신의 역할을 알아보세요. 분위기 메이커? 읽씹 장인? 정보통? 당신의 단톡방 포지션을 확인해보세요.',
    tags: ['테스트', '유형', '단톡방', '카톡', 'MBTI'],
    emoji: '💬',
    inputSchema: [],
    adPolicy: { questionAds: 1, resultSlots: ['A', 'B', 'C'], coupangCount: 1 },
    questionCount: 10,
    resultCount: 8,
  },
  {
    slug: 'work-meeting-type',
    category: 'test',
    type: 'personality-test',
    title: '회의 포지션 유형 테스트',
    subtitle: '회의실에서 당신의 진짜 역할은?',
    description: '10개의 질문으로 회의에서의 당신의 포지션을 분석합니다. 리더형? 아이디어뱅크? 조율자? 회의 속 진짜 당신을 만나보세요.',
    tags: ['테스트', '유형', '회의', '직장', '포지션'],
    emoji: '🏢',
    inputSchema: [],
    adPolicy: { questionAds: 1, resultSlots: ['A', 'B', 'C'], coupangCount: 1 },
    questionCount: 10,
    resultCount: 8,
  },

  // ─── 퀴즈 ───
  {
    slug: 'one-minute-quiz',
    category: 'quiz',
    type: 'quiz',
    title: '1분 상식 퀴즈',
    subtitle: '매일 바뀌는 10문항 도전',
    description: '매일 새로운 10개의 상식 문제에 도전하세요. 같은 날에는 같은 문제가 출제되니 친구와 점수를 비교해볼 수도 있습니다.',
    tags: ['퀴즈', '상식', '매일', '도전'],
    emoji: '🧠',
    inputSchema: [],
    adPolicy: { questionAds: 0, resultSlots: ['A', 'B'], coupangCount: 1 },
    questionCount: 10,
  },

  // ─── 게임 ───
  {
    slug: 'reaction-tap',
    category: 'game',
    type: 'game',
    title: '반응 속도 게임',
    subtitle: '1분 안에 얼마나 빠르게 반응할 수 있을까?',
    description: '화면이 바뀌는 순간 최대한 빠르게 탭하세요. 평균 반응 속도와 등급을 확인하고, 최고 기록에 도전해보세요.',
    tags: ['게임', '반응속도', '탭', '도전'],
    emoji: '⚡',
    inputSchema: [],
    adPolicy: { questionAds: 0, resultSlots: ['A', 'B'], coupangCount: 1 },
  },
];

export function getContentBySlug(slug: string): ContentEntry | undefined {
  return contentRegistry.find(c => c.slug === slug);
}

export function getContentByCategory(category: string): ContentEntry[] {
  return contentRegistry.filter(c => c.category === category);
}

export function getAllCategories(): { id: string; label: string; emoji: string }[] {
  return [
    { id: 'fortune', label: '운세', emoji: '🔮' },
    { id: 'test', label: '테스트', emoji: '📝' },
    { id: 'quiz', label: '퀴즈', emoji: '🧠' },
    { id: 'game', label: '게임', emoji: '🎮' },
  ];
}
