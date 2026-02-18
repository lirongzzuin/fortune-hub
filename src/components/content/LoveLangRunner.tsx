'use client';

import { useState, useMemo } from 'react';
import ResultView from './ResultView';
import AdSlot from '@/components/ad/AdSlot';
import { GenerateResultOutput } from '@/engine/types';

type Lang = 'WA' | 'QT' | 'RG' | 'AS' | 'PT';

interface LLQuestion {
  id: string; text: string;
  optionA: { label: string; lang: Lang };
  optionB: { label: string; lang: Lang };
}

// 5가지 사랑의 언어: WA(긍정적 언어) QT(함께하는 시간) RG(선물) AS(봉사) PT(스킨십)
const ALL_QUESTIONS: LLQuestion[] = [
  // WA vs QT
  { id: 'll1', text: '연인에게 받으면 가장 행복한 것은?',
    optionA: { label: '💌 "항상 믿어, 잘 할 수 있어" 진심 어린 말', lang: 'WA' },
    optionB: { label: '☕ 폰 내려놓고 둘만의 카페 데이트', lang: 'QT' } },
  { id: 'll2', text: '힘든 하루 끝에 연인에게 원하는 것은?',
    optionA: { label: '🗣️ "오늘 많이 힘들었겠다, 고생했어" 위로의 말', lang: 'WA' },
    optionB: { label: '🛋️ 말 없이 그냥 옆에 같이 있어주기', lang: 'QT' } },
  { id: 'll3', text: '연인이 내 노력을 알아줬으면 할 때?',
    optionA: { label: '🎤 "정말 열심히 했구나, 대단해" 소리 내어 말해주기', lang: 'WA' },
    optionB: { label: '👁️ 말 없이 내가 하는 것을 진지하게 지켜봐 주기', lang: 'QT' } },
  // WA vs RG
  { id: 'll4', text: '생일에 가장 받고 싶은 것은?',
    optionA: { label: '📝 손편지나 진심 담긴 메시지', lang: 'WA' },
    optionB: { label: '🎁 내가 원했던 작은 선물', lang: 'RG' } },
  { id: 'll5', text: '연인이 나를 생각한다는 게 느껴지는 순간은?',
    optionA: { label: '💬 "오늘 너 생각났어" 메시지', lang: 'WA' },
    optionB: { label: '🍪 지나가다 내가 좋아하는 걸 사다 줄 때', lang: 'RG' } },
  // WA vs AS
  { id: 'll6', text: '사랑받는다고 느끼는 순간은?',
    optionA: { label: '🌟 "네가 내 옆에 있어서 정말 다행이야" 고백', lang: 'WA' },
    optionB: { label: '🍳 내가 바쁠 때 식사나 청소를 먼저 해줄 때', lang: 'AS' } },
  { id: 'll7', text: '연인에게 가장 원하는 것은?',
    optionA: { label: '🎯 칭찬과 격려, 내 선택을 지지해주는 말', lang: 'WA' },
    optionB: { label: '🤝 내가 힘들 때 실질적으로 도와주는 행동', lang: 'AS' } },
  // WA vs PT
  { id: 'll8', text: '오랜만에 만난 연인에게 바라는 것은?',
    optionA: { label: '🗨️ "보고 싶었어, 얼마나 기다렸는지 몰라" 말로 전달', lang: 'WA' },
    optionB: { label: '🤗 긴 포옹 한 번', lang: 'PT' } },
  // QT vs RG
  { id: 'll9', text: '주말에 연인이 해줬으면 하는 것은?',
    optionA: { label: '📱 폰 없이 나랑만 있는 시간', lang: 'QT' },
    optionB: { label: '🌹 깜짝 꽃다발이나 작은 서프라이즈', lang: 'RG' } },
  { id: 'll10', text: '연인이 나를 특별하게 여긴다고 느끼는 순간?',
    optionA: { label: '⏰ 나를 위해 시간을 쪼개고 함께해 줄 때', lang: 'QT' },
    optionB: { label: '🎀 내가 좋아하는 걸 기억해뒀다가 선물해줄 때', lang: 'RG' } },
  // QT vs AS
  { id: 'll11', text: '피곤한 하루, 연인에게 가장 원하는 것은?',
    optionA: { label: '🎮 아무 말 없이 같이 드라마 보기', lang: 'QT' },
    optionB: { label: '💆 어깨 주물러주기나 물 가져다주기', lang: 'AS' } },
  { id: 'll12', text: '바쁜 시기에 연인이 해줬으면 하는 것은?',
    optionA: { label: '👥 짧더라도 매일 얼굴 보는 시간', lang: 'QT' },
    optionB: { label: '🧹 내 할 일을 대신 처리해주기', lang: 'AS' } },
  // QT vs PT
  { id: 'll13', text: '데이트에서 가장 소중한 순간은?',
    optionA: { label: '🌅 둘이 아무 말 없이 노을 보는 시간', lang: 'QT' },
    optionB: { label: '🤝 걸으면서 자연스럽게 손잡기', lang: 'PT' } },
  // RG vs AS
  { id: 'll14', text: '연인이 나를 생각한다는 게 가장 잘 느껴지는 것은?',
    optionA: { label: '🛍️ 여행에서 내 취향 저격 기념품 사다 줄 때', lang: 'RG' },
    optionB: { label: '🚗 내가 늦은 날 픽업하러 와줄 때', lang: 'AS' } },
  { id: 'll15', text: '연인의 어떤 행동이 가장 설레나요?',
    optionA: { label: '🎁 깜짝 선물, 작은 것도 OK', lang: 'RG' },
    optionB: { label: '🍱 내가 좋아하는 음식을 직접 만들어줄 때', lang: 'AS' } },
  // RG vs PT
  { id: 'll16', text: '기념일에 더 의미 있는 것은?',
    optionA: { label: '💍 공들인 선물', lang: 'RG' },
    optionB: { label: '💑 포옹이나 스킨십', lang: 'PT' } },
  // AS vs PT
  { id: 'll17', text: '아플 때 연인에게 받고 싶은 것은?',
    optionA: { label: '🍲 직접 죽 끓여서 가져다주기', lang: 'AS' },
    optionB: { label: '🛏️ 옆에서 손 잡아주기', lang: 'PT' } },
  { id: 'll18', text: '불안하거나 무서울 때 연인에게 원하는 것은?',
    optionA: { label: '🔦 "내가 다 해줄게" 실질적인 도움', lang: 'AS' },
    optionB: { label: '🤗 꼭 안아주기', lang: 'PT' } },
  // 추가 문항들
  { id: 'll19', text: '싸운 후 화해할 때 가장 좋은 것은?',
    optionA: { label: '🗣️ "미안해, 정말 네가 소중해" 진심 어린 사과의 말', lang: 'WA' },
    optionB: { label: '🤝 말 없이 손 내밀기', lang: 'PT' } },
  { id: 'll20', text: '연인이 무언가에 성공했을 때 가장 해주고 싶은 것은?',
    optionA: { label: '🎊 "진짜 대단하다! 자랑스러워" 소리 내어 칭찬', lang: 'WA' },
    optionB: { label: '🎁 깜짝 파티나 선물', lang: 'RG' } },
  { id: 'll21', text: '연인이 여행 중에 가장 기억에 남는 것은?',
    optionA: { label: '📸 둘이서 이야기하며 걸었던 시간', lang: 'QT' },
    optionB: { label: '🎁 현지에서 사준 작은 기념품', lang: 'RG' } },
  { id: 'll22', text: '연인이 가장 먼저 해줬으면 하는 것은?',
    optionA: { label: '💬 "오늘도 수고했어" 메시지', lang: 'WA' },
    optionB: { label: '🧹 집에 오면 집이 깔끔하게 정리돼 있기', lang: 'AS' } },
  { id: 'll23', text: '연인 없이 힘든 시간을 보낼 때?',
    optionA: { label: '📞 전화나 영상통화로 같이 있는 느낌', lang: 'QT' },
    optionB: { label: '📦 위로가 담긴 작은 선물 보내주기', lang: 'RG' } },
  { id: 'll24', text: '연인의 어떤 말이 가장 힘이 되나요?',
    optionA: { label: '🌟 "넌 항상 최선을 다하고 있어, 그게 보여"', lang: 'WA' },
    optionB: { label: '💪 "내가 옆에 있을게, 뭐든 같이 하자"', lang: 'AS' } },
  { id: 'll25', text: '바쁜 연인이 나를 위해 해준 것 중 가장 감동적인 것은?',
    optionA: { label: '⏰ 시간을 내서 직접 만나러 와줬을 때', lang: 'QT' },
    optionB: { label: '🛵 바쁜데도 음식이나 필요한 것을 갖다줄 때', lang: 'AS' } },
  // 더 많은 비교들
  { id: 'll26', text: '연인에게 "사랑해"라는 말보다 더 감동적인 것은?',
    optionA: { label: '🎭 "몇 년이 지나도 이런 감정 처음이야" 솔직한 표현', lang: 'WA' },
    optionB: { label: '💐 아무 이유 없이 꽃을 사다 줄 때', lang: 'RG' } },
  { id: 'll27', text: '자기 전에 연인에게 가장 원하는 것은?',
    optionA: { label: '🌙 "잘 자, 오늘도 고마워" 문자', lang: 'WA' },
    optionB: { label: '🤗 같이 있다면 안아주기', lang: 'PT' } },
  { id: 'll28', text: '외로울 때 연인에게 가장 원하는 것은?',
    optionA: { label: '📱 "지금 어때? 보고싶다" 연락', lang: 'WA' },
    optionB: { label: '🚶 갑자기 달려와서 옆에 있어주기', lang: 'QT' } },
  { id: 'll29', text: '연인의 작은 배려 중 가장 감동받는 것은?',
    optionA: { label: '🛒 내가 좋아하는 간식 몰래 사놓기', lang: 'RG' },
    optionB: { label: '🤲 어깨 주물러주거나 등 토닥여주기', lang: 'PT' } },
  { id: 'll30', text: '중요한 발표나 시험 전날, 연인에게 가장 원하는 것은?',
    optionA: { label: '💬 "넌 꼭 잘 할 거야, 믿어" 응원 메시지', lang: 'WA' },
    optionB: { label: '📚 같이 준비해주거나 옆에 있어주기', lang: 'QT' } },
  // 추가 15문항
  { id: 'll31', text: '연인이 내게 가장 잘 해줬으면 하는 것은?',
    optionA: { label: '💬 나의 의견과 감정을 언어로 표현해주기', lang: 'WA' },
    optionB: { label: '🛠️ 내가 힘들어하는 일을 먼저 나서서 도와주기', lang: 'AS' } },
  { id: 'll32', text: '여행 중 가장 좋아하는 순간은?',
    optionA: { label: '🏔️ 풍경 앞에서 말 없이 같이 앉아있는 시간', lang: 'QT' },
    optionB: { label: '🛍️ 여행지에서 서로 선물 고르기', lang: 'RG' } },
  { id: 'll33', text: '연인과의 일상 중 가장 행복한 순간은?',
    optionA: { label: '📺 같이 드라마 보면서 먹방하는 시간', lang: 'QT' },
    optionB: { label: '💆 아무 말 없이 서로 기대어 있는 시간', lang: 'PT' } },
  { id: 'll34', text: '좋아하는 감사 표현 방식은?',
    optionA: { label: '🗣️ "정말 고마워, 네가 없으면 어쩔 뻔"', lang: 'WA' },
    optionB: { label: '🧃 좋아하는 음료나 간식 챙겨주기', lang: 'AS' } },
  { id: 'll35', text: '싸우고 나서 연인이 해줬으면 하는 것은?',
    optionA: { label: '💌 진심이 담긴 사과 메시지나 편지', lang: 'WA' },
    optionB: { label: '🤗 말 없이 안아주기', lang: 'PT' } },
  { id: 'll36', text: '연인을 오래 못 봤을 때 가장 그리운 것은?',
    optionA: { label: '👥 같이 있던 시간들', lang: 'QT' },
    optionB: { label: '🤲 손잡기, 안기기 등 신체적 온기', lang: 'PT' } },
  { id: 'll37', text: '연인의 어떤 행동이 "이 사람이 나를 많이 생각하는구나" 느끼게 하나요?',
    optionA: { label: '🎁 내가 좋아하는 걸 기억해서 사다 줄 때', lang: 'RG' },
    optionB: { label: '✅ 내가 귀찮아하는 일을 알아서 처리해줄 때', lang: 'AS' } },
  { id: 'll38', text: '데이트 없이 집에 있는 날, 연인이 해줬으면 하는 것은?',
    optionA: { label: '🍕 좋아하는 음식 배달 시켜주기', lang: 'RG' },
    optionB: { label: '📞 영상통화로 같이 뭔가 하기', lang: 'QT' } },
  { id: 'll39', text: '연인이 가장 특별한 사람이라고 느끼는 순간은?',
    optionA: { label: '📝 "너랑 있으면 다른 사람이랑 달라" 말해줄 때', lang: 'WA' },
    optionB: { label: '💐 특별한 이유 없이 꽃이나 선물 사다 줄 때', lang: 'RG' } },
  { id: 'll40', text: '연인이 나를 위해 가장 해줬으면 하는 것은?',
    optionA: { label: '🛵 아플 때 달려와서 간호해주기', lang: 'AS' },
    optionB: { label: '💑 아무 말 없이 꼭 안아주기', lang: 'PT' } },
  { id: 'll41', text: '연인과 함께 있을 때 가장 행복한 순간은?',
    optionA: { label: '🌊 말 없이 바다 보며 손잡고 걷기', lang: 'QT' },
    optionB: { label: '🎁 서로 작은 선물 주고받기', lang: 'RG' } },
  { id: 'll42', text: '힘든 시간을 보낼 때 연인에게 바라는 것은?',
    optionA: { label: '🤝 "내가 도와줄 수 있는 거 있어?" 적극적 도움', lang: 'AS' },
    optionB: { label: '😢 등 토닥이며 "괜찮아"라고 해주기', lang: 'PT' } },
  { id: 'll43', text: '연인에게 가장 큰 감동을 주는 것은?',
    optionA: { label: '✍️ 직접 쓴 메모나 카드', lang: 'WA' },
    optionB: { label: '🧹 집에 왔을 때 청소나 요리가 되어있기', lang: 'AS' } },
  { id: 'll44', text: '가장 설레는 연애 장면은?',
    optionA: { label: '🚶 손잡고 거리를 걷는 것', lang: 'PT' },
    optionB: { label: '📖 나란히 앉아서 각자 책 읽는 시간', lang: 'QT' } },
  { id: 'll45', text: '연인에게 "우리 잘 맞는다" 느끼는 순간은?',
    optionA: { label: '💬 서로의 말을 잘 들어주고 공감할 때', lang: 'WA' },
    optionB: { label: '🤗 자연스럽게 손잡거나 기댈 때', lang: 'PT' } },
  { id: 'll46', text: '사랑받는다고 가장 확실히 느끼는 것은?',
    optionA: { label: '🗣️ 내가 잘 하고 있다는 말을 들을 때', lang: 'WA' },
    optionB: { label: '⏰ 상대가 나를 위해 시간을 내줄 때', lang: 'QT' } },
  { id: 'll47', text: '연인이 해준 것 중 가장 기억에 남는 것은?',
    optionA: { label: '📦 생각지도 못한 선물', lang: 'RG' },
    optionB: { label: '🤲 힘들 때 손 잡아준 것', lang: 'PT' } },
  { id: 'll48', text: '연인이 나를 가장 잘 이해한다고 느끼는 순간은?',
    optionA: { label: '💬 내 감정을 정확히 표현해줄 때', lang: 'WA' },
    optionB: { label: '✅ 말하지 않아도 내가 필요한 것을 해줄 때', lang: 'AS' } },
  { id: 'll49', text: '연인과의 관계에서 가장 중요한 것은?',
    optionA: { label: '🕰️ 함께 보내는 시간의 질', lang: 'QT' },
    optionB: { label: '💑 서로 기대고 안기는 스킨십', lang: 'PT' } },
  { id: 'll50', text: '연인이 나를 가장 사랑하는 방식은?',
    optionA: { label: '🎁 깜짝 선물이나 이벤트로 표현', lang: 'RG' },
    optionB: { label: '🛠️ 내 문제를 해결해주려고 노력하는 것', lang: 'AS' } },
];

const RESULTS: Record<Lang, {
  emoji: string; title: string; subtitle: string; summary: string;
  traits: string[]; doToday: string; avoidToday: string;
  visual: { emojis: string[]; gradient: string };
}> = {
  WA: {
    emoji: '💬', title: '긍정적 언어형',
    subtitle: '말로 사랑을 느끼고 표현합니다',
    summary: '당신은 언어로 사랑받을 때 가장 행복합니다. "사랑해", "정말 잘 했어", "네가 있어서 다행이야" 같은 말이 어떤 선물보다 소중합니다. 반대로 부정적인 말에 상처를 잘 받는 편이기도 합니다.',
    traits: ['언어 민감', '표현 중시', '진심을 말로'],
    doToday: '오늘 소중한 사람에게 진심을 담은 말을 전해보세요.',
    avoidToday: '말로 표현하지 않으면 상대가 모를 수 있어요',
    visual: { emojis: ['💬', '💌', '🗣️'], gradient: 'from-violet-500 to-purple-600' },
  },
  QT: {
    emoji: '⏰', title: '함께하는 시간형',
    subtitle: '온전한 집중과 함께하는 시간이 사랑입니다',
    summary: '당신은 연인이 폰을 내려놓고 오직 나에게 집중해줄 때 가장 사랑받는다고 느낍니다. 비싼 선물보다 "오늘 너랑만 있고 싶어"라는 말과 함께하는 시간이 더 소중합니다.',
    traits: ['현재 집중', '함께의 가치', '깊은 연결'],
    doToday: '오늘 소중한 사람과 폰 없이 온전히 함께하는 시간을 만들어보세요.',
    avoidToday: '같이 있지만 각자 폰만 보는 시간은 의미가 없어요',
    visual: { emojis: ['⏰', '☕', '🤝'], gradient: 'from-amber-500 to-orange-500' },
  },
  RG: {
    emoji: '🎁', title: '선물형',
    subtitle: '눈에 보이는 배려가 사랑입니다',
    summary: '당신은 선물을 통해 사랑을 느낍니다. 비싸지 않아도 되지만, 상대방이 나를 생각해서 선택한 것이라는 게 느껴질 때 감동합니다. "이걸 보는데 네가 생각나서"라는 말과 함께하는 작은 선물이 최고입니다.',
    traits: ['배려 감지', '시각적 사랑', '기억해주는 것'],
    doToday: '오늘 소중한 사람을 떠올리게 한 작은 것을 선물해보세요.',
    avoidToday: '선물을 받지 못해도 사랑받지 못하는 건 아니라는 것을 기억하세요',
    visual: { emojis: ['🎁', '🎀', '💝'], gradient: 'from-pink-500 to-rose-500' },
  },
  AS: {
    emoji: '🛠️', title: '봉사형',
    subtitle: '행동으로 보여주는 사랑입니다',
    summary: '당신은 상대방이 말이 아닌 행동으로 사랑을 보여줄 때 감동받습니다. 아플 때 약 사다 주기, 바쁠 때 집안일 해주기, 픽업해주기... 이런 작은 행동들이 어떤 말보다 마음을 움직입니다.',
    traits: ['행동 지향', '실질적 도움', '섬세한 배려'],
    doToday: '오늘 소중한 사람의 부담을 덜어줄 수 있는 행동을 해보세요.',
    avoidToday: '말보다 행동이 필요한 순간을 놓치지 마세요',
    visual: { emojis: ['🛠️', '🤝', '💪'], gradient: 'from-green-500 to-teal-600' },
  },
  PT: {
    emoji: '🤗', title: '스킨십형',
    subtitle: '온기와 신체적 연결이 사랑입니다',
    summary: '당신은 손잡기, 포옹, 토닥임 같은 신체적 접촉에서 사랑을 느낍니다. 어떤 말이나 선물보다 상대의 온기가 직접 느껴질 때 안정감과 사랑받는 느낌이 옵니다. 불안할 때 안아주는 것 하나면 됩니다.',
    traits: ['온기 민감', '신체 언어', '안정감 추구'],
    doToday: '오늘 소중한 사람에게 따뜻한 스킨십을 자연스럽게 표현해보세요.',
    avoidToday: '스킨십이 줄어들면 멀어진다는 느낌이 올 수 있어요',
    visual: { emojis: ['🤗', '💑', '🫂'], gradient: 'from-rose-400 to-pink-500' },
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

export default function LoveLangRunner() {
  const questions = useMemo(() => {
    const seed = Date.now() ^ (Math.random() * 0xffffffff);
    return shuffleWithSeed(ALL_QUESTIONS, seed).slice(0, 15);
  }, []);

  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<Lang, number>>({ WA: 0, QT: 0, RG: 0, AS: 0, PT: 0 });
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  const q = questions[current];
  const showMidAd = current === 7;

  const handleChoice = (choice: 'a' | 'b') => {
    if (selected) return;
    setSelected(choice);
    const lang = choice === 'a' ? q.optionA.lang : q.optionB.lang;
    setScores(prev => ({ ...prev, [lang]: prev[lang] + 1 }));

    setTimeout(() => {
      if (current + 1 >= questions.length) setFinished(true);
      else { setCurrent(prev => prev + 1); setSelected(null); }
    }, 500);
  };

  if (finished) {
    const top = (Object.entries(scores) as [Lang, number][]).sort(([, a], [, b]) => b - a)[0][0];
    const r = RESULTS[top];

    const output: GenerateResultOutput = {
      resultKey: `love-lang-${top}`,
      summary: `${r.emoji} ${r.title}`,
      keywords: r.traits,
      doToday: r.doToday,
      avoidToday: r.avoidToday,
      detailSections: [
        { area: 'type',   label: r.title,    emoji: r.emoji, text: r.summary },
        { area: 'score',  label: '점수 분포', emoji: '📊',
          text: `말(${scores.WA}) · 시간(${scores.QT}) · 선물(${scores.RG}) · 봉사(${scores.AS}) · 스킨십(${scores.PT})` },
        { area: 'traits', label: '나의 특성', emoji: '✨', text: r.traits.join(' · ') },
        { area: 'tip',    label: '연애 팁',   emoji: '💡', text: r.doToday },
      ],
      personalDetail: `15가지 상황에서 당신이 가장 많이 선택한 사랑의 언어는 ${r.title}입니다.`,
      shareCard: {
        title: `나의 연애 언어: ${r.title}`,
        summary: r.subtitle,
        keywords: [r.title, ...r.traits.slice(0, 2)],
      },
      meta: { disclaimer: false, generatedAt: new Date().toISOString().slice(0, 10) },
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
        <ResultView result={output} slug="love-language-test" />
      </div>
    );
  }

  const pct = Math.round((current / questions.length) * 100);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-gray-400 font-medium">{current + 1}/{questions.length}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
            💝 두 가지 중 더 마음에 드는 것을 고르세요
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
                  isSelected ? 'border-pink-500 bg-pink-50 text-pink-900' :
                  isOther ? 'border-gray-100 text-gray-300' :
                  'border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50 active:scale-[0.98]'
                }`}
              >
                {opt.label}
                {isSelected && <span className="ml-2 text-pink-500">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {showMidAd && <AdSlot slot="A" provider="adsense" className="mt-1" />}

      <p className="text-xs text-center text-gray-400">
        둘 다 좋아도 더 원하는 것을 직감으로 골라보세요 💝
      </p>
    </div>
  );
}
