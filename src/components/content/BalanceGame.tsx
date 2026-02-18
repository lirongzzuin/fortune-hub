'use client';

import { useState } from 'react';
import ResultView from './ResultView';
import { GenerateResultOutput } from '@/engine/types';

const QUESTIONS = [
  { id: 'q1',  a: '😤 똥맛 카레 먹기',                    b: '💩 카레맛 똥 먹기' },
  { id: 'q2',  a: '👔 전 애인과 한 직장 다니기',            b: '🏠 전 애인 부모님과 한집 살기' },
  { id: 'q3',  a: '💬 말할 때마다 방귀 소리 나기',          b: '🚶 걸을 때마다 뽁뽁이 소리 나기' },
  { id: 'q4',  a: '📵 유튜브 광고 평생 스킵 불가',          b: '📴 카톡 읽씹 여부 평생 확인 불가' },
  { id: 'q5',  a: '✈️ 평생 비행기 중간 좌석만',             b: '🚇 평생 출퇴근 지하철만 이용' },
  { id: 'q6',  a: '🌙 새벽 3시에만 입맛 폭발',              b: '🍽️ 평생 혼자서만 밥 먹기' },
  { id: 'q7',  a: '📲 내 카톡 대화 전부 공개',              b: '🎥 내 모든 흑역사 영상 공개' },
  { id: 'q8',  a: '🪫 폰 배터리 항상 3%',                  b: '🔌 폰 항상 충전 중인데 22%' },
  { id: 'q9',  a: '🛏️ 잘 때마다 베개가 떡이 됨',            b: '🪑 앉을 때마다 뜨거운 음료 엎질러진 의자' },
  { id: 'q10', a: '⏰ 매일 출근 10분 전에 깨기',            b: '😴 매일 밤 배 불러서 못 자기' },
  { id: 'q11', a: '🐛 SNS에 벌레 광고만 뜨기',              b: '🕵️ 내 검색 기록 가족 단톡방 공개' },
  { id: 'q12', a: '🍜 라면 먹을 때마다 냄비 설거지',        b: '📦 배달마다 용기 씻어서 분리수거' },
  { id: 'q13', a: '⏪ 수능 다시 보기',                      b: '⏩ 지금부터 10년 점프 (돌이킬 수 없음)' },
  { id: 'q14', a: '🦶 평생 맨발로만 살기',                  b: '🧤 평생 장갑 끼고만 살기' },
  { id: 'q15', a: '👻 내 모든 취향 공개',                   b: '💀 내 전 연인들이 친목 모임 가짐' },
];

type ResultType = {
  emoji: string;
  title: string;
  summary: string;
  describe: string;
  traits: string[];
  doToday: string;
  avoidToday: string;
};

const RESULTS: ResultType[] = [
  {
    emoji: '🕊️', title: 'B형 현실주의자',
    summary: 'B를 선호하는 당신은 냉철한 판단을 합니다',
    describe: 'B를 많이 골랐군요. 현실적 판단력이 탁월합니다. 고통보다 타협을 선택하는 지혜로운 삶. (주의: 이 사람 옆에 있으면 갑자기 합리적인 말을 들을 수 있음)',
    traits: ['현실주의', '냉철함', '타협의 달인'],
    doToday: '오늘도 합리적인 선택을 하세요. 당신의 강점입니다.',
    avoidToday: '너무 계산적으로 굴면 재미없어 보일 수 있어요',
  },
  {
    emoji: '🤷', title: '균형형 생존자',
    summary: '어떤 지옥이든 버틸 준비가 된 당신',
    describe: '뭐가 더 나쁜지 재는 데 시간이 걸렸죠? 신중하고 균형 잡힌 판단을 하는 타입. 어떤 상황에서도 살아남을 것 같은 느낌이 납니다.',
    traits: ['균형감', '신중함', '생존력'],
    doToday: '어떤 선택이든 후회하지 않을 자신이 있으면 그게 맞는 선택입니다.',
    avoidToday: '너무 오래 고민하다 기회를 놓치지 마세요',
  },
  {
    emoji: '😤', title: '소신파 A선택자',
    summary: 'A를 많이 골랐지만 거기엔 당신만의 논리가 있습니다',
    describe: 'A를 많이 골랐지만 소신이 있습니다. 남들이 이해 못 해도 당신의 판단엔 당신만의 논리가 있어요. 그게 맞는지는... 음.',
    traits: ['소신', '독특한 논리', '개성'],
    doToday: '당신의 독특한 관점을 두려워하지 마세요. 그게 매력입니다.',
    avoidToday: '너무 A만 고집하다 진짜 중요한 것을 놓치지 마세요',
  },
  {
    emoji: '🔥', title: '자가고문 수집가',
    summary: '왜 더 힘든 걸 고르셨나요? 걱정됩니다',
    describe: 'A를 자주 고른 당신, 스스로 힘든 길을 선택하는 경향이 있어요. 이미 많은 고통을 경험해서 감각이 무뎌진 걸까요? 주변에 물어봐 드릴게요. 아 잠깐, 주변이 도망가고 없겠구나.',
    traits: ['고통 내성', '자기고문', '경험치 만렙'],
    doToday: '오늘만큼은 편한 것을 선택해보세요. 당신도 행복할 자격이 있습니다.',
    avoidToday: '굳이 힘든 길을 찾아가지 마세요. 힘든 건 알아서 옵니다.',
  },
  {
    emoji: '💀', title: '고통의 경지에 오른 자',
    summary: '전부 A... 이미 무감각해진 걸까요?',
    describe: '전부 또는 거의 A를 고르셨습니다. 당신은 이미 모든 것을 경험했거나, 진짜 무서운 분이거나 둘 중 하나입니다. 어디서든 살아남을 것 같아서 오히려 존경스럽습니다.',
    traits: ['무적 멘탈', '경험치 초월', '생존왕'],
    doToday: '당신은 이미 뭐든 견딜 수 있습니다. 오늘은 그냥 쉬세요.',
    avoidToday: '굳이 더 어렵게 살지 않아도 돼요. 이미 충분히 어렵습니다.',
  },
];

function getResult(aCount: number): ResultType {
  if (aCount <= 3)  return RESULTS[0];
  if (aCount <= 7)  return RESULTS[1];
  if (aCount <= 10) return RESULTS[2];
  if (aCount <= 14) return RESULTS[3];
  return RESULTS[4];
}

function buildOutput(aCount: number, total: number): GenerateResultOutput {
  const r = getResult(aCount);
  return {
    resultKey: `balance-${aCount}-of-${total}`,
    summary: `${r.emoji} ${r.title}`,
    keywords: r.traits,
    doToday: r.doToday,
    avoidToday: r.avoidToday,
    detailSections: [
      { area: 'type',    label: r.title,       emoji: r.emoji, text: r.describe },
      { area: 'ratio',   label: '선택 비율',    emoji: '📊', text: `A 선택 ${aCount}회, B 선택 ${total - aCount}회 / 총 ${total}문제` },
      { area: 'traits',  label: '당신의 특성',  emoji: '🔍', text: r.traits.join(' · ') },
      { area: 'advice',  label: '오늘의 한 마디', emoji: '💡', text: r.doToday },
    ],
    personalDetail: `A를 ${aCount}번 선택한 당신의 지옥 내성은 ${Math.round((aCount / total) * 100)}% 수준입니다.`,
    shareCard: {
      title: `지옥의 밸런스 게임 결과: ${r.title}`,
      summary: r.summary,
      keywords: r.traits,
    },
    meta: { disclaimer: false, generatedAt: new Date().toISOString().slice(0, 10) },
  };
}

export default function BalanceGame() {
  const [current, setCurrent] = useState(0);
  const [aCount, setACount] = useState(0);
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);

  const q = QUESTIONS[current];
  const progress = ((current) / QUESTIONS.length) * 100;

  const handleChoice = (choice: 'a' | 'b') => {
    if (animating || selected) return;
    setSelected(choice);
    setAnimating(true);
    if (choice === 'a') setACount(prev => prev + 1);

    setTimeout(() => {
      if (current + 1 >= QUESTIONS.length) {
        setFinished(true);
      } else {
        setCurrent(prev => prev + 1);
        setSelected(null);
        setAnimating(false);
      }
    }, 600);
  };

  if (finished) {
    const finalA = selected === 'a' ? aCount : aCount;
    const result = buildOutput(finalA, QUESTIONS.length);
    return <ResultView result={result} slug="hell-balance" />;
  }

  return (
    <div className="space-y-5">
      {/* 진행 바 */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">{current + 1}/{QUESTIONS.length}</span>
      </div>

      {/* VS 카드 */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-5 py-3 flex items-center gap-2">
          <span className="text-white font-black text-sm">😈 지옥의 선택</span>
          <span className="ml-auto text-orange-100 text-xs">Q{current + 1}</span>
        </div>

        {/* 선택지 */}
        <div className="flex flex-col gap-0">
          {/* 선택지 A */}
          <button
            onClick={() => handleChoice('a')}
            disabled={!!selected}
            className={`w-full p-6 text-left transition-all duration-300 ${
              selected === 'a'
                ? 'bg-orange-500 text-white scale-[0.98]'
                : selected === 'b'
                ? 'bg-gray-50 text-gray-300'
                : 'bg-white hover:bg-orange-50 active:scale-[0.98]'
            }`}
          >
            <p className="text-[15px] font-bold leading-relaxed">{q.a}</p>
            {selected === 'a' && <p className="text-orange-100 text-xs mt-1">✓ 선택됨</p>}
          </button>

          {/* VS 구분선 */}
          <div className="relative h-12 flex items-center justify-center bg-gray-50 border-y border-gray-100">
            <span className="absolute bg-red-500 text-white text-sm font-black px-4 py-1 rounded-full shadow-md z-10">
              VS
            </span>
            <div className="w-full h-px bg-gray-200" />
          </div>

          {/* 선택지 B */}
          <button
            onClick={() => handleChoice('b')}
            disabled={!!selected}
            className={`w-full p-6 text-left transition-all duration-300 ${
              selected === 'b'
                ? 'bg-purple-500 text-white scale-[0.98]'
                : selected === 'a'
                ? 'bg-gray-50 text-gray-300'
                : 'bg-white hover:bg-purple-50 active:scale-[0.98]'
            }`}
          >
            <p className="text-[15px] font-bold leading-relaxed">{q.b}</p>
            {selected === 'b' && <p className="text-purple-100 text-xs mt-1">✓ 선택됨</p>}
          </button>
        </div>
      </div>

      {/* 하단 안내 */}
      <p className="text-xs text-center text-gray-400">
        당신이라면 하나를 선택해야 한다면? 둘 다 싫어도 골라야 합니다 😈
      </p>

      {/* 이전 선택 현황 */}
      {current > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-400 px-1">
          <span>A 선택: <strong className="text-orange-500">{aCount}회</strong></span>
          <span>·</span>
          <span>B 선택: <strong className="text-purple-500">{current - aCount}회</strong></span>
        </div>
      )}
    </div>
  );
}
