'use client';

import { useState } from 'react';
import ResultView from './ResultView';
import { GenerateResultOutput } from '@/engine/types';

type Dim = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

interface MBTIQuestion {
  id: string; text: string;
  optionA: { label: string; dim: Dim };
  optionB: { label: string; dim: Dim };
}

const QUESTIONS: MBTIQuestion[] = [
  // E vs I
  { id: 'm1', text: '갑자기 주말에 친구가 "놀러 가자!" 연락이 왔다.',
    optionA: { label: '🎉 "오케이!! 어디?" 바로 나간다', dim: 'E' },
    optionB: { label: '😬 "오늘 좀 쉬고 싶었는데..." 핑계 생각 중', dim: 'I' } },
  { id: 'm2', text: '새로운 모임에 처음 참석했다.',
    optionA: { label: '😁 낯선 사람에게 먼저 말 건다', dim: 'E' },
    optionB: { label: '🫥 누가 말 걸어줄 때까지 기다린다', dim: 'I' } },
  { id: 'm3', text: '긴 미팅이 끝나면?',
    optionA: { label: '⚡ 오히려 에너지가 충전된 것 같다', dim: 'E' },
    optionB: { label: '🪫 배터리가 방전되어 혼자 있고 싶다', dim: 'I' } },
  // S vs N
  { id: 'm4', text: '여행 계획을 세울 때 나는?',
    optionA: { label: '📍 숙소·교통·식당 다 예약해두는 완벽 준비', dim: 'S' },
    optionB: { label: '🗺️ 대충 방향만 잡고 가서 즉흥으로', dim: 'N' } },
  { id: 'm5', text: '"이게 맞는 건지 모르겠어" 고민이 생겼을 때?',
    optionA: { label: '📊 경험과 데이터를 바탕으로 판단한다', dim: 'S' },
    optionB: { label: '💭 직감이나 육감을 더 믿는다', dim: 'N' } },
  { id: 'm6', text: '대화할 때 나는?',
    optionA: { label: '📌 구체적 사실과 세부 내용 위주', dim: 'S' },
    optionB: { label: '🌈 추상적 개념이나 미래 가능성 위주', dim: 'N' } },
  // T vs F
  { id: 'm7', text: '친구가 "나 이거 어때 보여?"라고 물을 때?',
    optionA: { label: '💬 솔직하게 의견을 말한다 (들으라고 물은 거잖아)', dim: 'T' },
    optionB: { label: '🥰 일단 기분 맞춰주고 조심스럽게 이야기한다', dim: 'F' } },
  { id: 'm8', text: '누군가 나에게 상처 주는 말을 했을 때?',
    optionA: { label: '🧮 "왜 그런 말을 했는지" 논리를 분석한다', dim: 'T' },
    optionB: { label: '😢 일단 감정이 먼저 터진다', dim: 'F' } },
  { id: 'm9', text: '팀 프로젝트에서 의견 충돌이 생겼을 때?',
    optionA: { label: '⚖️ 합리적으로 옳은 방향으로 밀어붙인다', dim: 'T' },
    optionB: { label: '🤝 팀 분위기와 모두의 감정을 먼저 챙긴다', dim: 'F' } },
  // J vs P
  { id: 'm10', text: '할 일 목록(to-do)에 대한 나의 자세?',
    optionA: { label: '✅ 목록 있음, 순서대로, 완료 체크 최고', dim: 'J' },
    optionB: { label: '🌀 대충 머릿속에, 생각나면 한다', dim: 'P' } },
  { id: 'm11', text: '마감 기한이 있는 과제?',
    optionA: { label: '⏰ 미리 다 해두고 여유 있게 제출', dim: 'J' },
    optionB: { label: '🔥 마감 직전 집중 폭발 모드 (마감이 친구)', dim: 'P' } },
  { id: 'm12', text: '갑작스러운 계획 변경이 생겼을 때?',
    optionA: { label: '😤 당황스럽다. 계획이 틀어지면 불편하다', dim: 'J' },
    optionB: { label: '🙆 오히려 좋아? 유연하게 대처한다', dim: 'P' } },
];

const MBTI_RESULTS: Record<string, { emoji: string; title: string; summary: string; traits: string[]; doToday: string; avoidToday: string }> = {
  INTJ: { emoji: '🧠', title: 'INTJ — 전략가',      summary: '독립적이고 분석적. 세상을 체스판처럼 봅니다. 믿는 사람은 몇 명 없지만 그게 맞다고 생각함.',       traits: ['전략적', '독립적', '냉철'], doToday: '장기 계획을 구체적으로 정리해보세요', avoidToday: '감정적인 상황에서 즉각 반응하지 마세요' },
  INTP: { emoji: '🔬', title: 'INTP — 논리학자',    summary: '호기심과 분석력이 넘칩니다. "왜?"라는 질문이 삶의 동력. 머릿속은 항상 바쁘지만 겉은 조용함.',    traits: ['논리적', '호기심', '분석가'], doToday: '관심 있는 주제 하나를 깊이 파고들어보세요', avoidToday: '완벽한 계획을 기다리다 아무것도 못 하지 마세요' },
  ENTJ: { emoji: '👑', title: 'ENTJ — 지휘관',      summary: '타고난 리더. 목표를 향해 직진하며 비효율을 참지 못함. 말보다 실행, 실행보다 결과.',             traits: ['리더십', '결단력', '목표지향'], doToday: '중요한 일 하나를 오늘 바로 실행에 옮기세요', avoidToday: '혼자 다 하려다 팀원을 소외시키지 마세요' },
  ENTP: { emoji: '💡', title: 'ENTP — 발명가',      summary: '아이디어 공장. 토론을 즐기고 규칙보다 가능성을 봅니다. 지루한 걸 가장 못 견딤.',              traits: ['창의적', '논쟁적', '혁신적'], doToday: '새로운 아이디어를 메모해두고 하나 실험해보세요', avoidToday: '시작만 하고 마무리를 못 짓는 패턴을 의식하세요' },
  INFJ: { emoji: '🌌', title: 'INFJ — 예언자',      summary: '드물고 깊습니다. 사람을 잘 읽고 이상을 추구하며 혼자 있는 시간이 꼭 필요한 타입.',             traits: ['통찰력', '이상주의', '공감'], doToday: '자신의 가치관에 맞는 일을 하나 해보세요', avoidToday: '모든 사람을 구하려다 스스로 지치지 마세요' },
  INFP: { emoji: '🦋', title: 'INFP — 중재자',      summary: '감수성이 풍부하고 자신만의 세계가 있습니다. 착하지만 뒤에서 많이 상처받는 유형.',              traits: ['감수성', '이상주의', '창의적'], doToday: '오늘 하루 느낀 감정을 글로 써보세요', avoidToday: '자기 자신을 너무 가혹하게 대하지 마세요' },
  ENFJ: { emoji: '🌟', title: 'ENFJ — 주인공',      summary: '사람들을 이끌고 영감을 줍니다. 모두가 잘 되길 바라는 진심 어린 응원단장.',                    traits: ['카리스마', '공감', '리더십'], doToday: '주변 사람에게 진심 어린 격려의 말을 전해보세요', avoidToday: '남을 돕느라 자신을 돌보는 걸 잊지 마세요' },
  ENFP: { emoji: '🎨', title: 'ENFP — 활동가',      summary: '열정 폭발, 가능성 탐험가. 새로운 것에 흥분하고 사람에게 에너지를 받는 자유로운 영혼.',        traits: ['열정적', '자유로운', '창의적'], doToday: '한 가지를 끝까지 마무리해보는 연습을 해보세요', avoidToday: '너무 많은 것을 동시에 시작하지 마세요' },
  ISTJ: { emoji: '📋', title: 'ISTJ — 현실주의자',  summary: '믿음직하고 철저합니다. 약속을 지키고 계획대로 사는 것이 행복. 맡은 일은 반드시 완수함.',      traits: ['신뢰성', '체계적', '성실함'], doToday: '오늘의 할 일을 목록으로 만들고 하나씩 체크하세요', avoidToday: '변화를 무조건 거부하지 말고 한 번은 시도해보세요' },
  ISFJ: { emoji: '🛡️', title: 'ISFJ — 수호자',      summary: '조용한 영웅. 남을 위해 헌신하고 배려하지만 자기 공을 드러내지 않는 든든한 존재.',             traits: ['배려심', '헌신적', '책임감'], doToday: '오늘은 자신을 위한 것을 하나 해보세요', avoidToday: '"아니오"라고 말하는 연습이 필요합니다' },
  ESTJ: { emoji: '⚙️', title: 'ESTJ — 경영자',      summary: '체계와 질서를 사랑합니다. 규칙이 있어야 안심되고 효율이 없으면 답답한 실용주의자.',           traits: ['체계적', '실용적', '리더십'], doToday: '팀의 목표를 명확하게 공유해보세요', avoidToday: '자신의 방식만이 옳다는 고집을 내려놓아보세요' },
  ESFJ: { emoji: '🤗', title: 'ESFJ — 집정관',      summary: '따뜻하고 사교적. 모두가 행복하길 바라며 분위기를 챙기는 모임의 윤활유 같은 존재.',            traits: ['사교적', '배려', '조화'], doToday: '소중한 사람에게 먼저 연락해보세요', avoidToday: '남의 평가를 지나치게 신경쓰지 마세요' },
  ISTP: { emoji: '🔧', title: 'ISTP — 장인',        summary: '말보다 행동. 이론보다 실험. 문제가 생기면 직접 뜯어보고 고치는 쿨한 현실주의자.',            traits: ['현실적', '독립적', '분석적'], doToday: '오늘 손으로 직접 무언가를 해보세요', avoidToday: '감정 표현을 너무 닫아두지 마세요' },
  ISFP: { emoji: '🌸', title: 'ISFP — 모험가',      summary: '조용하지만 자신만의 감성이 뚜렷합니다. 아름다운 것을 사랑하고 자유를 소중히 여김.',          traits: ['감성적', '자유로운', '예술적'], doToday: '오늘 당신의 감성을 표현할 방법을 찾아보세요', avoidToday: '결정을 너무 오래 미루지 마세요' },
  ESTP: { emoji: '⚡', title: 'ESTP — 사업가',      summary: '행동하면서 생각하는 타입. 이론보다 경험, 계획보다 즉흥. 위기 상황에서 가장 빛남.',            traits: ['행동력', '적응력', '즉흥적'], doToday: '지금 당장 가능한 것을 하나 실행해보세요', avoidToday: '장기적 결과를 고려하지 않고 돌진하지 마세요' },
  ESFP: { emoji: '🎉', title: 'ESFP — 연예인',      summary: '삶 자체가 파티. 에너지 넘치고 즉흥적이며 지금 이 순간을 즐기는 것이 최우선.',               traits: ['활발함', '즐거움', '즉흥적'], doToday: '오늘 하루를 즐겁게 보낼 계획을 세워보세요', avoidToday: '중요한 것을 즐거움 때문에 미루지 마세요' },
};

export default function MBTIRunner() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<Dim, number>>({ E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 });
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  const q = QUESTIONS[current];

  const handleChoice = (choice: 'a' | 'b') => {
    if (selected) return;
    setSelected(choice);
    const dim = choice === 'a' ? q.optionA.dim : q.optionB.dim;
    setScores(prev => ({ ...prev, [dim]: prev[dim] + 1 }));

    setTimeout(() => {
      if (current + 1 >= QUESTIONS.length) setFinished(true);
      else { setCurrent(prev => prev + 1); setSelected(null); }
    }, 500);
  };

  if (finished) {
    const e = scores.E >= scores.I ? 'E' : 'I';
    const s = scores.S >= scores.N ? 'S' : 'N';
    const t = scores.T >= scores.F ? 'T' : 'F';
    const j = scores.J >= scores.P ? 'J' : 'P';
    const mbtiType = `${e}${s}${t}${j}`;
    const r = MBTI_RESULTS[mbtiType] ?? MBTI_RESULTS.ENTP;

    const output: GenerateResultOutput = {
      resultKey: `mbti-${mbtiType}`,
      summary: `${r.emoji} ${r.title}`,
      keywords: r.traits,
      doToday: r.doToday,
      avoidToday: r.avoidToday,
      detailSections: [
        { area: 'type',   label: r.title.split(' — ')[1] ?? r.title, emoji: r.emoji, text: r.summary },
        { area: 'score',  label: '나의 성향 점수', emoji: '📊',
          text: `외향(E) ${scores.E} vs 내향(I) ${scores.I} · 감각(S) ${scores.S} vs 직관(N) ${scores.N}\n사고(T) ${scores.T} vs 감정(F) ${scores.F} · 계획(J) ${scores.J} vs 즉흥(P) ${scores.P}` },
        { area: 'traits', label: '핵심 특성',      emoji: '✨', text: r.traits.join(' · ') },
        { area: 'tip',    label: '오늘의 제안',    emoji: '💡', text: r.doToday },
      ],
      personalDetail: `12개 상황 질문 결과 당신은 ${mbtiType} 성향이 가장 강하게 나왔습니다.`,
      shareCard: {
        title: `MBTI 상황 테스트 결과: ${mbtiType} ${r.title.split(' — ')[1] ?? ''}`,
        summary: r.summary,
        keywords: [mbtiType, ...r.traits.slice(0, 2)],
      },
      meta: { disclaimer: true, generatedAt: new Date().toISOString().slice(0, 10) },
    };
    return <ResultView result={output} slug="mbti-situation" />;
  }

  const pct = Math.round((current / QUESTIONS.length) * 100);
  const dimLabel = current < 3 ? 'E/I 외향·내향' : current < 6 ? 'S/N 감각·직관' : current < 9 ? 'T/F 사고·감정' : 'J/P 계획·즉흥';

  return (
    <div className="space-y-5">
      {/* 진행 바 */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">{current + 1}/{QUESTIONS.length}</span>
      </div>

      {/* 현재 차원 배지 */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
          📐 {dimLabel}
        </span>
      </div>

      {/* 질문 카드 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p className="text-base font-bold text-gray-900 mb-5 leading-snug">{q.text}</p>

        <div className="space-y-3">
          {(['a', 'b'] as const).map((choice) => {
            const opt = choice === 'a' ? q.optionA : q.optionB;
            const isSelected = selected === choice;
            const isOther = selected !== null && selected !== choice;
            return (
              <button
                key={choice}
                onClick={() => handleChoice(choice)}
                disabled={!!selected}
                className={`w-full text-left px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-violet-500 bg-violet-50 text-violet-900'
                    : isOther
                    ? 'border-gray-100 text-gray-300'
                    : 'border-gray-200 text-gray-700 hover:border-violet-300 hover:bg-violet-50 active:scale-[0.98]'
                }`}
              >
                {opt.label}
                {isSelected && <span className="ml-2 text-violet-500">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-center text-gray-400">
        정답이 없어요! 실제 상황이라면 어떻게 할지 솔직하게 골라보세요 🎯
      </p>
    </div>
  );
}
