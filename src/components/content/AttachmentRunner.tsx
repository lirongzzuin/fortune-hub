'use client';

import { useState, useMemo } from 'react';
import ResultView from './ResultView';
import { GenerateResultOutput } from '@/engine/types';

type AStyle = 'secure' | 'anxious' | 'avoidant' | 'disorganized';

interface AQuestion {
  id: string; text: string;
  optionA: { label: string; style: AStyle };
  optionB: { label: string; style: AStyle };
}

// 4가지 애착 유형: secure(안정), anxious(불안), avoidant(회피), disorganized(혼란)
const ALL_QUESTIONS: AQuestion[] = [
  // Secure vs Anxious
  { id: 'at1', text: '연인이 답장이 늦을 때 나는?',
    optionA: { label: '😌 바쁠 수도 있겠지. 나중에 올 거야', style: 'secure' },
    optionB: { label: '😰 왜 답이 없지? 뭔가 잘못됐나? 확인해볼까?', style: 'anxious' } },
  { id: 'at2', text: '연인이 친구들과 여행을 간다고 했을 때?',
    optionA: { label: '🏝️ 잘 다녀와! 즐겁게 놀다 와', style: 'secure' },
    optionB: { label: '😟 나 없이 가도 괜찮을까? 거기서 다른 사람 만나면 어쩌지', style: 'anxious' } },
  { id: 'at3', text: '연인이 갑자기 조용해졌을 때?',
    optionA: { label: '🤔 뭔가 있나 보다. 물어보자', style: 'secure' },
    optionB: { label: '💭 나 때문인가? 내가 뭘 잘못했나 계속 생각됨', style: 'anxious' } },
  { id: 'at4', text: '연인과 가끔 혼자만의 시간이 필요할 때?',
    optionA: { label: '🧘 각자의 시간도 중요하니까 이해해', style: 'secure' },
    optionB: { label: '😔 혼자 있고 싶다고? 나랑 있기 싫은 건가?', style: 'anxious' } },
  // Secure vs Avoidant
  { id: 'at5', text: '연인이 "나 요즘 좀 힘들어"라고 말할 때?',
    optionA: { label: '🤗 무슨 일인지 이야기해봐. 같이 생각해보자', style: 'secure' },
    optionB: { label: '🫤 왜 갑자기 이런 이야기를... 어떻게 해줘야 하지', style: 'avoidant' } },
  { id: 'at6', text: '연인에게 "사랑해"라는 말 하기?',
    optionA: { label: '💬 자연스럽게 자주 표현하는 편이다', style: 'secure' },
    optionB: { label: '😶 그런 말이 왠지 부끄럽고 입에서 잘 안 나온다', style: 'avoidant' } },
  { id: 'at7', text: '연인이 감정적으로 힘들어할 때?',
    optionA: { label: '🫂 옆에서 같이 있어주고 들어준다', style: 'secure' },
    optionB: { label: '🏃 "알아서 해결해야 할 것 같은데..." 내심 불편하다', style: 'avoidant' } },
  { id: 'at8', text: '친밀감이 깊어질수록 느끼는 감정은?',
    optionA: { label: '😊 편안하고 좋다. 더 가까워지고 싶다', style: 'secure' },
    optionB: { label: '😬 가까워질수록 왠지 부담스럽고 도망가고 싶다', style: 'avoidant' } },
  // Secure vs Disorganized
  { id: 'at9', text: '연인을 많이 좋아하게 됐을 때?',
    optionA: { label: '🥰 기분 좋고 설렌다. 더 알아가고 싶다', style: 'secure' },
    optionB: { label: '😰 이 감정이 무서워진다. 상처받을까봐 두렵다', style: 'disorganized' } },
  { id: 'at10', text: '연인에게 의존하게 되는 것에 대해?',
    optionA: { label: '😌 적당히 기대는 것, 관계에서 자연스러운 일이다', style: 'secure' },
    optionB: { label: '😖 기대고 싶지만 동시에 너무 기대면 안 될 것 같다', style: 'disorganized' } },
  // Anxious vs Avoidant
  { id: 'at11', text: '연인이 갑자기 연락이 뜸해졌을 때?',
    optionA: { label: '📱 계속 확인하게 되고, 먼저 연락해서 확인하게 된다', style: 'anxious' },
    optionB: { label: '😐 나도 그냥 연락 줄인다. 서로 거리 두는 거겠지', style: 'avoidant' } },
  { id: 'at12', text: '연인이 "우리 너무 자주 보는 것 같아"라고 하면?',
    optionA: { label: '😟 나를 덜 보고 싶다는 건가? 거부당하는 느낌이 든다', style: 'anxious' },
    optionB: { label: '😌 나도 사실 조금 숨이 막혔는데, 잘됐다', style: 'avoidant' } },
  { id: 'at13', text: '연인에게 먼저 사랑한다고 말하는 것은?',
    optionA: { label: '💌 먼저 말하고 싶다. 안 하면 전달이 안 될까봐 불안하다', style: 'anxious' },
    optionB: { label: '🤐 그런 말이 부담스럽다. 상대가 먼저 해줬으면 한다', style: 'avoidant' } },
  // Anxious vs Disorganized
  { id: 'at14', text: '연인이 나를 좋아하는지 확신이 없을 때?',
    optionA: { label: '😰 계속 물어보거나 확인하고 싶어진다', style: 'anxious' },
    optionB: { label: '😖 좋아해주길 바라지만 동시에 그게 더 무섭기도 하다', style: 'disorganized' } },
  { id: 'at15', text: '연인에게 상처받았을 때?',
    optionA: { label: '😤 바로 감정을 표현하고 화해하고 싶다', style: 'anxious' },
    optionB: { label: '🌀 화해하고 싶지만 다가가기도 두렵고, 혼란스럽다', style: 'disorganized' } },
  // Avoidant vs Disorganized
  { id: 'at16', text: '연인에게 마음을 열어야 할 때?',
    optionA: { label: '🧱 쉽지 않다. 감정을 드러내는 게 약점인 것 같다', style: 'avoidant' },
    optionB: { label: '🌀 열고 싶지만 거부당할까봐, 어떻게 해야 할지 모르겠다', style: 'disorganized' } },
  { id: 'at17', text: '연애가 잘 되어갈 때?',
    optionA: { label: '😐 왠지 불편해지고, 거리를 두고 싶어진다', style: 'avoidant' },
    optionB: { label: '😰 잘 되고 있는데도 왜 불안하지? 곧 나쁜 일이 생길 것 같다', style: 'disorganized' } },
  // 추가 문항
  { id: 'at18', text: '싸운 다음 날 연인에게 어떻게 하나요?',
    optionA: { label: '🤝 상황을 정리하고 먼저 화해하자고 한다', style: 'secure' },
    optionB: { label: '😔 계속 마음이 쓰이고 상대가 먼저 사과를 해야 한다는 생각도 든다', style: 'anxious' } },
  { id: 'at19', text: '연인이 다른 이성과 친한 것을 알게 됐을 때?',
    optionA: { label: '😌 신뢰하니까. 물어보면 되고, 크게 불안하지 않다', style: 'secure' },
    optionB: { label: '😟 자꾸 신경 쓰이고 연인의 SNS를 더 자주 보게 된다', style: 'anxious' } },
  { id: 'at20', text: '연인이 내 감정 이야기를 들어줄 때?',
    optionA: { label: '😊 편하게 이야기할 수 있고, 들어줘서 고맙다', style: 'secure' },
    optionB: { label: '😶 굳이 이런 이야기까지 해야 하나 싶다. 혼자 해결하는 게 낫다', style: 'avoidant' } },
  { id: 'at21', text: '연인과 처음으로 깊은 대화를 나눌 때?',
    optionA: { label: '💬 솔직하게 이야기할 수 있어서 더 가까워진 느낌이다', style: 'secure' },
    optionB: { label: '🌀 마음을 열고 싶으면서도 동시에 도망가고 싶다', style: 'disorganized' } },
  { id: 'at22', text: '연인이 바쁜 시간을 보내고 있을 때?',
    optionA: { label: '📌 이해하고 기다린다. 끝나면 연락이 오겠지', style: 'secure' },
    optionB: { label: '📱 자꾸 폰을 보게 된다. 내가 우선순위가 아닌 것 같아 불안하다', style: 'anxious' } },
  { id: 'at23', text: '연인에게 도움을 요청해야 할 때?',
    optionA: { label: '🤝 도움 받는 게 자연스럽다. 편하게 부탁한다', style: 'secure' },
    optionB: { label: '🙅 부탁하면 부담될까봐 혼자 해결하려고 한다', style: 'avoidant' } },
  { id: 'at24', text: '연인에게 상처를 주었을 때?',
    optionA: { label: '😔 바로 사과하고 대화로 해결하고 싶다', style: 'secure' },
    optionB: { label: '😖 사과하고 싶은데 어떻게 해야 할지 모르겠고 혼란스럽다', style: 'disorganized' } },
  { id: 'at25', text: '새로운 연인이 생겼을 때?',
    optionA: { label: '🥰 설레고 기대된다. 더 알아가고 싶다', style: 'secure' },
    optionB: { label: '😰 좋지만 동시에 "이게 맞나?" 계속 확인하게 된다', style: 'anxious' } },
  { id: 'at26', text: '연인이 나와 다른 생각을 가질 때?',
    optionA: { label: '💬 다름을 인정하고 서로 이야기하면 된다', style: 'secure' },
    optionB: { label: '😟 우리가 안 맞는 건가? 관계에 문제가 생긴 건 아닐까', style: 'anxious' } },
  { id: 'at27', text: '연인에게 의존하게 되는 상황에서?',
    optionA: { label: '😌 적당한 의존은 건강한 관계의 일부다', style: 'secure' },
    optionB: { label: '😬 의존하는 게 싫다. 독립적으로 있고 싶다', style: 'avoidant' } },
  { id: 'at28', text: '오랜 연애 후 관계가 안정적으로 느껴질 때?',
    optionA: { label: '😊 편안하고 좋다. 이 관계가 믿음직하다', style: 'secure' },
    optionB: { label: '🌀 안정되면 왠지 더 잃을 것 같고 불안하다', style: 'disorganized' } },
  // 30개 이상 확보
  { id: 'at29', text: '연인이 나에게 화를 낼 때?',
    optionA: { label: '🗣️ 감정이 격해지지 않게 대화로 풀려고 한다', style: 'secure' },
    optionB: { label: '😤 나도 감정이 격해지거나 아예 말을 안 하게 된다', style: 'anxious' } },
  { id: 'at30', text: '연인이 나에게 화를 낼 때?',
    optionA: { label: '🤐 말을 줄이고 혼자 생각 정리가 필요하다', style: 'avoidant' },
    optionB: { label: '🌀 싸우는 것 자체가 두렵고 관계가 끝날까봐 패닉이 온다', style: 'disorganized' } },
  { id: 'at31', text: '이별을 경험한 후 나는?',
    optionA: { label: '😔 힘들지만 시간이 지나면 회복된다', style: 'secure' },
    optionB: { label: '💔 이별 후에도 계속 상대가 생각나고 쉽게 놓지 못한다', style: 'anxious' } },
  { id: 'at32', text: '이별을 경험한 후 나는?',
    optionA: { label: '😐 솔직히 혼자인 게 더 편하다고 느꼈다', style: 'avoidant' },
    optionB: { label: '🌀 정리가 안 되고, 상대를 원망하면서도 그리워하는 상태가 오래갔다', style: 'disorganized' } },
  { id: 'at33', text: '사랑받고 있다고 느끼는 순간은?',
    optionA: { label: '😊 연인이 신뢰해주고 편안하게 대해줄 때', style: 'secure' },
    optionB: { label: '💬 연인이 자주 표현해주고 확인시켜줄 때', style: 'anxious' } },
  { id: 'at34', text: '나의 연애 패턴을 돌아보면?',
    optionA: { label: '🙂 대체로 건강하고 안정적이었다', style: 'secure' },
    optionB: { label: '😔 왠지 항상 내가 더 많이 좋아했던 것 같다', style: 'anxious' } },
  { id: 'at35', text: '나의 연애 패턴을 돌아보면?',
    optionA: { label: '🧊 상대방이 더 가까워지려 할 때 후퇴한 적이 많다', style: 'avoidant' },
    optionB: { label: '🌀 연애를 원하지만 매번 상처받을 것 같아 시작도 두렵다', style: 'disorganized' } },
];

const RESULTS: Record<AStyle, {
  emoji: string; title: string; subtitle: string; summary: string;
  traits: string[]; doToday: string; avoidToday: string;
  visual: { emojis: string[]; gradient: string };
}> = {
  secure: {
    emoji: '😊', title: '안정형',
    subtitle: '건강한 연애의 기준점',
    summary: '당신은 안정 애착 유형입니다. 연인과의 관계에서 편안함과 신뢰를 느끼며, 상대방의 독립성도 존중할 수 있습니다. 갈등이 생겨도 대화로 해결하고자 하며, 혼자와 함께 사이의 균형을 잘 유지합니다. 가장 건강한 애착 패턴입니다.',
    traits: ['신뢰', '균형', '건강한 독립'],
    doToday: '소중한 관계에 감사함을 표현해보세요.',
    avoidToday: '과도한 기대로 상대를 부담스럽게 하지 마세요',
    visual: { emojis: ['😊', '🌟', '🤝'], gradient: 'from-green-400 to-emerald-600' },
  },
  anxious: {
    emoji: '😰', title: '불안형',
    subtitle: '사랑받는 것이 가장 걱정되는 유형',
    summary: '당신은 불안 애착 유형입니다. 연인에 대한 애정이 깊은 만큼 상실과 거부에 대한 두려움도 큽니다. 상대방의 작은 변화에도 민감하게 반응하고, 확인하고 싶어지는 경향이 있습니다. 이는 과거의 경험에서 비롯된 자연스러운 반응입니다.',
    traits: ['감정 민감', '확인 욕구', '깊은 애정'],
    doToday: '오늘은 연인에게 연락하기 전에 10분 자신만의 시간을 가져보세요.',
    avoidToday: '상대방의 반응을 과도하게 분석하는 것을 의식적으로 줄여보세요',
    visual: { emojis: ['😰', '💭', '🫀'], gradient: 'from-yellow-400 to-orange-500' },
  },
  avoidant: {
    emoji: '🧊', title: '회피형',
    subtitle: '가까워질수록 멀어지고 싶어지는 유형',
    summary: '당신은 회피 애착 유형입니다. 독립성을 매우 중요하게 여기며 친밀감이 깊어질수록 부담을 느끼는 경향이 있습니다. 감정 표현이 쉽지 않고, 도움을 요청하거나 받는 것이 불편할 수 있습니다. 이는 어릴 때 형성된 자기 의존 패턴에서 비롯됩니다.',
    traits: ['독립 지향', '감정 절제', '거리 유지'],
    doToday: '오늘은 소중한 사람에게 작은 감사의 말 한 마디를 표현해보세요.',
    avoidToday: '상대방을 멀리하는 것이 관계를 더 안전하게 만들지는 않아요',
    visual: { emojis: ['🧊', '🏔️', '🌙'], gradient: 'from-blue-500 to-slate-600' },
  },
  disorganized: {
    emoji: '🌀', title: '혼란형',
    subtitle: '원하지만 두려운, 모순된 감정의 유형',
    summary: '당신은 혼란 애착 유형입니다. 친밀함을 원하면서도 동시에 두려워하는 복잡한 감정 패턴을 가지고 있습니다. 관계에서 예측하기 어려운 행동을 보일 수 있으며, 과거의 힘든 경험이 현재 관계에 영향을 주고 있을 수 있습니다. 전문가의 도움으로 크게 개선될 수 있습니다.',
    traits: ['양가감정', '예측 어려움', '치유 필요'],
    doToday: '자신의 감정 패턴을 기록해보는 것이 이해에 도움이 됩니다.',
    avoidToday: '혼자서 모든 것을 해결하려 하지 말고 전문가의 도움을 두려워하지 마세요',
    visual: { emojis: ['🌀', '💜', '🌧️'], gradient: 'from-purple-500 to-indigo-600' },
  },
};

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AttachmentRunner() {
  const questions = useMemo(() => {
    const seed = Date.now() ^ (Math.random() * 0xffffffff);
    return shuffleWithSeed(ALL_QUESTIONS, seed).slice(0, 12);
  }, []);

  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<AStyle, number>>({ secure: 0, anxious: 0, avoidant: 0, disorganized: 0 });
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  const q = questions[current];
  const handleChoice = (choice: 'a' | 'b') => {
    if (selected) return;
    setSelected(choice);
    const style = choice === 'a' ? q.optionA.style : q.optionB.style;
    setScores(prev => ({ ...prev, [style]: prev[style] + 1 }));

    setTimeout(() => {
      if (current + 1 >= questions.length) setFinished(true);
      else { setCurrent(prev => prev + 1); setSelected(null); }
    }, 500);
  };

  if (finished) {
    const top = (Object.entries(scores) as [AStyle, number][]).sort(([, a], [, b]) => b - a)[0][0];
    const r = RESULTS[top];

    const output: GenerateResultOutput = {
      resultKey: `attachment-${top}`,
      summary: `${r.emoji} ${r.title}`,
      keywords: r.traits,
      doToday: r.doToday,
      avoidToday: r.avoidToday,
      detailSections: [
        { area: 'type',   label: r.title,    emoji: r.emoji, text: r.summary },
        { area: 'score',  label: '유형별 점수', emoji: '📊',
          text: `안정(${scores.secure}) · 불안(${scores.anxious}) · 회피(${scores.avoidant}) · 혼란(${scores.disorganized})` },
        { area: 'traits', label: '나의 특성', emoji: '✨', text: r.traits.join(' · ') },
        { area: 'tip',    label: '성장 팁',   emoji: '💡', text: r.doToday },
      ],
      personalDetail: `12가지 상황 질문으로 분석한 결과 ${r.title} 패턴이 가장 강하게 나타났습니다.`,
      shareCard: {
        title: `나의 애착 유형: ${r.title}`,
        summary: r.subtitle,
        keywords: [r.title, ...r.traits.slice(0, 2)],
      },
      meta: { disclaimer: true, generatedAt: new Date().toISOString().slice(0, 10) },
    };

    return (
      <div className="space-y-4">
        <div className={`bg-gradient-to-br ${r.visual.gradient} rounded-2xl p-8 text-center shadow-lg`}>
          <div className="flex justify-center gap-3 mb-3">
            {r.visual.emojis.map((em, i) => <span key={i} className="text-5xl">{em}</span>)}
          </div>
          <h2 className="text-2xl font-black text-white mb-1">{r.title}</h2>
          <p className="text-white/80 text-sm">{r.subtitle}</p>
        </div>
        <ResultView result={output} slug="attachment-style-test" />
      </div>
    );
  }

  const pct = Math.round((current / questions.length) * 100);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-gray-400 font-medium">{current + 1}/{questions.length}</span>
      </div>

      <div key={current} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
            🫂 솔직한 내 반응을 골라보세요
          </span>
        </div>
        <p className="text-base font-bold text-gray-900 mb-5 leading-snug">{q.text}</p>
        <div className="space-y-3">
          {(['a', 'b'] as const).map((choice) => {
            const opt = choice === 'a' ? q.optionA : q.optionB;
            const isSelected = selected === choice;
            const isOther = selected !== null && selected !== choice;
            return (
              <button key={choice} onClick={() => handleChoice(choice)} disabled={!!selected}
                className={`w-full text-left px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  isSelected ? 'border-purple-500 bg-purple-50 text-purple-900' :
                  isOther ? 'border-gray-100 text-gray-300' :
                  'border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 active:scale-[0.98]'
                }`}
              >
                {opt.label}
                {isSelected && <span className="ml-2 text-purple-500">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-center text-gray-400">
        정답이 없어요. 가장 솔직한 반응이 가장 정확한 결과를 줍니다 🫂
      </p>
    </div>
  );
}
