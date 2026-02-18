'use client';

import { useState, useMemo } from 'react';
import ResultView from './ResultView';
import LeaderboardSection from '@/components/game/LeaderboardSection';
import { GenerateResultOutput } from '@/engine/types';

/* ── 22 Major Arcana ── */
const CARDS = [
  { id: 0,  name: '바보',       emoji: '🃏', upright: '새로운 시작, 모험, 무한한 가능성' },
  { id: 1,  name: '마법사',     emoji: '🎩', upright: '의지력, 능력, 실현' },
  { id: 2,  name: '여교황',     emoji: '🌙', upright: '직관, 신비, 내면의 지혜' },
  { id: 3,  name: '여황제',     emoji: '🌺', upright: '풍요, 창조, 양육' },
  { id: 4,  name: '황제',       emoji: '🏛️', upright: '권위, 안정, 구조' },
  { id: 5,  name: '교황',       emoji: '📿', upright: '전통, 지도, 믿음' },
  { id: 6,  name: '연인',       emoji: '💕', upright: '사랑, 선택, 조화' },
  { id: 7,  name: '전차',       emoji: '⚡', upright: '결단, 승리, 의지' },
  { id: 8,  name: '힘',         emoji: '🦁', upright: '용기, 내면의 힘, 인내' },
  { id: 9,  name: '은둔자',     emoji: '🕯️', upright: '내면 탐구, 고독, 지혜' },
  { id: 10, name: '운명의 바퀴', emoji: '🎡', upright: '변화, 행운, 순환' },
  { id: 11, name: '정의',       emoji: '⚖️', upright: '균형, 진실, 공정' },
  { id: 12, name: '매달린 자',  emoji: '🌀', upright: '수용, 기다림, 새 관점' },
  { id: 13, name: '죽음',       emoji: '🌑', upright: '변환, 끝과 시작, 전환' },
  { id: 14, name: '절제',       emoji: '🌊', upright: '균형, 인내, 조화' },
  { id: 15, name: '악마',       emoji: '🔗', upright: '집착, 물질, 해방 필요' },
  { id: 16, name: '탑',         emoji: '⚡', upright: '갑작스런 변화, 각성' },
  { id: 17, name: '별',         emoji: '⭐', upright: '희망, 갱신, 영감' },
  { id: 18, name: '달',         emoji: '🌕', upright: '환상, 직관, 무의식' },
  { id: 19, name: '태양',       emoji: '☀️', upright: '기쁨, 활력, 성공' },
  { id: 20, name: '심판',       emoji: '🎺', upright: '각성, 부활, 성찰' },
  { id: 21, name: '세계',       emoji: '🌍', upright: '완성, 통합, 성취' },
];

/* 포지션별 해석 접두사 */
const POSITIONS = [
  { label: '과거 (지나온 것)',    prefix: '지나온 당신의 삶에서 ' },
  { label: '현재 (지금 이 순간)', prefix: '지금 이 순간 당신에게 ' },
  { label: '미래 (앞으로 올 것)', prefix: '앞으로 당신에게 ' },
];

/* 카드별 포지션 메시지 (간략화) */
const CARD_MSGS: Record<number, [string, string, string]> = {
  0:  ['자유롭게 살아온 시간이 새로운 여정의 씨앗이 되었습니다', '두려움을 내려놓고 새로운 가능성을 향해 한 발 내딛을 때입니다', '예상치 못한 모험이 당신을 기다리고 있습니다'],
  1:  ['타고난 능력을 갈고닦아온 당신의 노력이 빛을 발하고 있습니다', '당신에게 필요한 모든 능력은 이미 갖춰져 있습니다', '뛰어난 실력이 인정받는 순간이 다가오고 있습니다'],
  2:  ['직관이 당신을 이끌어온 덕분에 지금의 자리에 있습니다', '내면의 목소리에 귀를 기울일 때입니다', '숨겨진 진실이 조용히 드러날 것입니다'],
  3:  ['풍요로운 관계와 창조적 에너지가 당신을 성장시켰습니다', '자신을 사랑하고 아끼는 에너지가 넘칩니다', '창조적 번영과 풍요로운 결실이 피어날 것입니다'],
  4:  ['강력한 기반 위에서 안정을 구축해온 당신입니다', '체계와 일관성이 지금의 당신에게 힘을 줍니다', '안정적인 구조가 당신의 목표를 실현시켜줄 것입니다'],
  5:  ['전통과 믿음이 당신의 뿌리가 되어주었습니다', '신뢰할 수 있는 조언자의 말에 귀를 기울이세요', '멘토나 선생의 도움이 중요한 방향을 제시해줄 것입니다'],
  6:  ['소중한 사랑이 당신의 심장을 뛰게 해왔습니다', '마음을 열고 진정한 선택을 할 시간입니다', '아름다운 인연이 당신의 삶에 찾아올 것입니다'],
  7:  ['불굴의 의지로 어려움을 이겨온 당신입니다', '자신을 믿고 목표를 향해 전진하세요', '노력의 결실이 승리로 돌아오는 시간이 옵니다'],
  8:  ['내면의 강인함이 어려운 시간을 버티게 해주었습니다', '부드러운 힘으로 상황을 이끌어가세요', '진정한 용기가 당신의 길을 열어줄 것입니다'],
  9:  ['고독한 성찰이 깊은 지혜를 가져다주었습니다', '잠시 홀로 서서 내면을 들여다볼 시간입니다', '내면의 빛이 가야 할 길을 밝혀줄 것입니다'],
  10: ['변화의 물결이 당신에게 새로운 기회를 가져다주었습니다', '흐름을 받아들이고 변화에 유연하게 대응하세요', '행운의 바퀴가 당신에게 유리하게 돌아올 것입니다'],
  11: ['공정한 판단력으로 균형을 유지해왔습니다', '진실과 공정함이 당신의 나침반이 됩니다', '올바른 선택에 대한 공정한 결과가 돌아올 것입니다'],
  12: ['다른 시각으로 세상을 바라본 경험이 당신을 성숙하게 했습니다', '잠시 멈추고 기다리는 지혜를 발휘할 때입니다', '포기처럼 보이는 것이 사실은 더 큰 것을 위한 준비입니다'],
  13: ['중요한 무언가를 내려놓음으로써 새로운 자신이 되었습니다', '낡은 것을 놓아보내야 새로운 것이 들어옵니다', '끝은 곧 새로운 시작이 됩니다. 두려워하지 마세요'],
  14: ['인내와 균형이 당신의 삶을 단단하게 해주었습니다', '서두르지 않고 차분히 조화를 찾아가세요', '꾸준한 노력이 조화로운 결과를 만들어냅니다'],
  15: ['집착에서 벗어나는 과정이 당신을 더 자유롭게 만들었습니다', '내면을 가두는 두려움이나 습관을 직시하세요', '벗어남의 용기가 당신에게 진정한 자유를 가져다줄 것입니다'],
  16: ['갑작스러운 변화가 오히려 당신을 깨어나게 했습니다', '지금 예상치 못한 전환이 오더라도 당신은 괜찮습니다', '큰 변화 뒤에 당신이 원하던 새로운 세상이 펼쳐집니다'],
  17: ['희망을 잃지 않은 당신의 믿음이 여기까지 이끌었습니다', '별빛처럼 희망을 품고 앞으로 나아가세요', '영감과 치유의 빛이 당신의 앞길을 비춰줄 것입니다'],
  18: ['직관과 꿈이 당신의 길을 안내해왔습니다', '보이는 것과 느껴지는 것 모두 신뢰하세요', '무의식의 신호가 중요한 진실을 알려줄 것입니다'],
  19: ['따뜻한 에너지와 순수한 기쁨이 당신의 삶에 가득했습니다', '삶의 활력과 긍정적 에너지가 넘칩니다', '밝고 풍요로운 결과가 당신을 기다리고 있습니다'],
  20: ['중요한 변화와 재탄생을 경험한 당신입니다', '과거를 성찰하고 새로운 사명을 발견할 시간입니다', '삶의 새로운 장이 열리며 큰 각성이 찾아올 것입니다'],
  21: ['오랜 여정 끝에 완성의 기쁨을 느끼고 있습니다', '하나의 완전한 사이클이 마무리되고 있습니다', '완전한 성취와 통합의 순간이 다가오고 있습니다'],
};

/* 오늘 날짜 기반 시드 셔플 */
function shuffleToday<T>(arr: T[]): T[] {
  const seed = new Date().toISOString().slice(0, 10)
    .split('-').reduce((a, b) => a * 100 + Number(b), 0);
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TarotRunner() {
  const shuffled = useMemo(() => shuffleToday(CARDS), []);
  const [picked, setPicked] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);

  const togglePick = (id: number) => {
    if (revealed) return;
    if (picked.includes(id)) {
      setPicked(prev => prev.filter(p => p !== id));
    } else if (picked.length < 3) {
      setPicked(prev => [...prev, id]);
    }
  };

  if (revealed && picked.length === 3) {
    const cards = picked.map(id => CARDS.find(c => c.id === id)!);
    const msgs = cards.map((c, i) => `${POSITIONS[i].prefix}${CARD_MSGS[c.id]?.[i] ?? c.upright}`);

    const output: GenerateResultOutput = {
      resultKey: `tarot-${picked.join('-')}`,
      summary: `${cards.map(c => c.emoji).join(' ')} ${cards.map(c => c.name).join(' · ')}`,
      keywords: cards.map(c => c.name),
      doToday: `${cards[1].name} 카드가 오늘의 나침반입니다. ${msgs[1].slice(0, 30)}...`,
      avoidToday: '타로는 가능성을 보여줄 뿐, 미래를 확정하지 않습니다. 행동이 운명을 바꿉니다.',
      detailSections: [
        { area: 'past',    label: `과거 — ${cards[0].name}`, emoji: cards[0].emoji, text: `${cards[0].upright}\n\n${msgs[0]}` },
        { area: 'present', label: `현재 — ${cards[1].name}`, emoji: cards[1].emoji, text: `${cards[1].upright}\n\n${msgs[1]}` },
        { area: 'future',  label: `미래 — ${cards[2].name}`, emoji: cards[2].emoji, text: `${cards[2].upright}\n\n${msgs[2]}` },
      ],
      personalDetail: `오늘 당신이 뽑은 카드: ${cards.map(c => `${c.emoji}${c.name}`).join(', ')}`,
      shareCard: {
        title: `오늘의 타로: ${cards.map(c => c.name).join(' · ')}`,
        summary: cards.map(c => c.upright).join(' / '),
        keywords: cards.map(c => c.name),
      },
      meta: { disclaimer: true, generatedAt: new Date().toISOString().slice(0, 10) },
    };

    return (
      <div className="space-y-4">
        <LeaderboardSection slug="tarot-daily" score={1} scoreLabel="" sortOrder="desc" />
        {/* 카드 결과 카드 */}
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 text-center shadow-lg">
          <p className="text-white/60 text-xs mb-3">오늘의 3장 타로</p>
          <div className="flex justify-center gap-4 mb-4">
            {cards.map((card, i) => (
              <div key={card.id} className="flex-1 max-w-[90px]">
                <div className="bg-white/10 rounded-xl p-3 mb-2 border border-white/20">
                  <div className="text-3xl mb-1">{card.emoji}</div>
                  <div className="text-white text-xs font-bold">{card.name}</div>
                </div>
                <div className="text-white/50 text-xs">{POSITIONS[i].label.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
        <ResultView result={output} slug="tarot-daily" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 안내 */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-5 text-center">
        <p className="text-white text-sm font-medium">
          {picked.length < 3
            ? `마음 가는 카드 3장을 선택하세요 (${picked.length}/3)`
            : '3장을 모두 선택했습니다. 공개 버튼을 눌러주세요!'}
        </p>
        <p className="text-white/50 text-xs mt-1">직감을 믿으세요 ✨</p>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-4 gap-2">
        {shuffled.map((card) => {
          const isSelected = picked.includes(card.id);
          const isFull = picked.length >= 3 && !isSelected;
          return (
            <button
              key={card.id}
              onClick={() => togglePick(card.id)}
              disabled={isFull}
              className={`aspect-[2/3] rounded-xl border-2 transition-all text-center flex flex-col items-center justify-center p-1 ${
                isSelected
                  ? 'border-purple-400 bg-purple-100 scale-95 shadow-lg'
                  : isFull
                  ? 'border-gray-200 bg-gray-100 opacity-40'
                  : 'border-indigo-200 bg-gradient-to-b from-indigo-800 to-purple-900 active:scale-95'
              }`}
            >
              {isSelected ? (
                <>
                  <span className="text-2xl">{card.emoji}</span>
                  <span className="text-purple-800 text-xs font-bold mt-1 leading-tight">
                    {card.name}
                  </span>
                </>
              ) : (
                <span className="text-2xl opacity-30">🂠</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 공개 버튼 */}
      {picked.length === 3 && (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-[0.98]"
        >
          ✨ 타로 공개하기
        </button>
      )}

      {/* 선택 취소 안내 */}
      {picked.length > 0 && picked.length < 3 && (
        <p className="text-center text-xs text-gray-400">
          선택한 카드를 다시 누르면 취소됩니다
        </p>
      )}
    </div>
  );
}
