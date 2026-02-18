'use client';

import { useState, useMemo } from 'react';
import ResultView from './ResultView';
import { GenerateResultOutput } from '@/engine/types';

type Dim = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

interface MBTIQuestion {
  id: string; text: string;
  optionA: { label: string; dim: Dim };
  optionB: { label: string; dim: Dim };
}

// 풀 문항 풀 (차원별 13문항 이상, 총 52+문항)
const ALL_QUESTIONS: MBTIQuestion[] = [
  // ─── E vs I (13문항) ───
  { id: 'm_ei1', text: '갑자기 주말에 친구가 "놀러 가자!" 연락이 왔다.',
    optionA: { label: '🎉 "오케이!! 어디?" 바로 나간다', dim: 'E' },
    optionB: { label: '😬 "오늘 좀 쉬고 싶었는데..." 핑계 생각 중', dim: 'I' } },
  { id: 'm_ei2', text: '새로운 모임에 처음 참석했다.',
    optionA: { label: '😁 낯선 사람에게 먼저 말 건다', dim: 'E' },
    optionB: { label: '🫥 누가 말 걸어줄 때까지 기다린다', dim: 'I' } },
  { id: 'm_ei3', text: '긴 미팅이 끝나면?',
    optionA: { label: '⚡ 오히려 에너지가 충전된 것 같다', dim: 'E' },
    optionB: { label: '🪫 배터리가 방전되어 혼자 있고 싶다', dim: 'I' } },
  { id: 'm_ei4', text: '혼자 있는 주말 오후, 친구가 카페 가자고 한다.',
    optionA: { label: '☕ 당연히 가야지! 혼자 있으면 심심하다', dim: 'E' },
    optionB: { label: '😌 솔직히 혼자 있는 게 더 편한데...', dim: 'I' } },
  { id: 'm_ei5', text: '발표나 PT가 있을 때 나는?',
    optionA: { label: '🎤 약간 긴장되지만 오히려 신난다', dim: 'E' },
    optionB: { label: '😰 발표 전날까지 긴장해서 잠을 못 잔다', dim: 'I' } },
  { id: 'm_ei6', text: '모임에서 사람들을 처음 만날 때?',
    optionA: { label: '🙌 여러 사람에게 먼저 인사하고 대화를 시작한다', dim: 'E' },
    optionB: { label: '🤫 한두 명과 깊게 이야기하는 게 더 좋다', dim: 'I' } },
  { id: 'm_ei7', text: '스트레스 받을 때 해소 방법은?',
    optionA: { label: '🗣️ 친구나 가족에게 이야기하면서 풀린다', dim: 'E' },
    optionB: { label: '🏠 혼자만의 공간에서 쉬어야 풀린다', dim: 'I' } },
  { id: 'm_ei8', text: '같이 일하는 것 vs 혼자 일하는 것?',
    optionA: { label: '👥 같이 할 때 아이디어가 더 잘 나온다', dim: 'E' },
    optionB: { label: '🧑‍💻 혼자 집중할 때 성과가 더 좋다', dim: 'I' } },
  { id: 'm_ei9', text: '파티에서 아는 사람이 없다면?',
    optionA: { label: '🌈 오히려 새 사람 사귀는 기회! 먼저 다가간다', dim: 'E' },
    optionB: { label: '📱 핸드폰 보거나 아는 사람 찾아 구석에 있는다', dim: 'I' } },
  { id: 'm_ei10', text: '주말을 가장 즐겁게 보내는 방법은?',
    optionA: { label: '🎡 친구들과 놀러 다니기, 많은 사람 만나기', dim: 'E' },
    optionB: { label: '📖 집에서 조용히 혼자만의 시간 즐기기', dim: 'I' } },
  { id: 'm_ei11', text: '오랜 친구를 우연히 만났다.',
    optionA: { label: '🤗 반갑게 한참 이야기하고 밥도 먹고 싶다', dim: 'E' },
    optionB: { label: '👋 반갑지만 짧게 인사하고 헤어지는 게 더 좋다', dim: 'I' } },
  { id: 'm_ei12', text: '그룹 채팅방 스타일은?',
    optionA: { label: '💬 활발하게 참여, 먼저 이야기 꺼내기도 한다', dim: 'E' },
    optionB: { label: '🔕 읽기만 하거나 꼭 필요할 때만 답한다', dim: 'I' } },
  { id: 'm_ei13', text: '여행 중 현지 사람과 대화 기회가 생겼다.',
    optionA: { label: '✈️ 적극적으로 말을 걸고 친해지고 싶다', dim: 'E' },
    optionB: { label: '🤷 말이 잘 통하지 않으면 그냥 지나치는 게 편하다', dim: 'I' } },

  // ─── S vs N (13문항) ───
  { id: 'm_sn1', text: '여행 계획을 세울 때 나는?',
    optionA: { label: '📍 숙소·교통·식당 다 예약해두는 완벽 준비', dim: 'S' },
    optionB: { label: '🗺️ 대충 방향만 잡고 가서 즉흥으로', dim: 'N' } },
  { id: 'm_sn2', text: '"이게 맞는 건지 모르겠어" 고민이 생겼을 때?',
    optionA: { label: '📊 경험과 데이터를 바탕으로 판단한다', dim: 'S' },
    optionB: { label: '💭 직감이나 육감을 더 믿는다', dim: 'N' } },
  { id: 'm_sn3', text: '대화할 때 나는?',
    optionA: { label: '📌 구체적 사실과 세부 내용 위주', dim: 'S' },
    optionB: { label: '🌈 추상적 개념이나 미래 가능성 위주', dim: 'N' } },
  { id: 'm_sn4', text: '새 직장/학교를 시작할 때?',
    optionA: { label: '📋 규칙과 절차를 먼저 파악한다', dim: 'S' },
    optionB: { label: '🔍 큰 그림과 앞으로의 가능성을 먼저 생각한다', dim: 'N' } },
  { id: 'm_sn5', text: '책이나 영화를 고를 때?',
    optionA: { label: '⭐ 실제 리뷰와 평점, 검증된 것 위주', dim: 'S' },
    optionB: { label: '✨ 독특하고 상상력 자극하는 것 선호', dim: 'N' } },
  { id: 'm_sn6', text: '요리를 할 때 나는?',
    optionA: { label: '📏 레시피 정확히 따라서 만든다', dim: 'S' },
    optionB: { label: '🎨 레시피는 참고만, 즉흥으로 넣고 싶은 것 넣는다', dim: 'N' } },
  { id: 'm_sn7', text: '친구가 고민을 털어놨을 때?',
    optionA: { label: '🔧 구체적인 해결책을 먼저 제안한다', dim: 'S' },
    optionB: { label: '🌟 근본적인 원인이나 더 큰 의미를 탐구한다', dim: 'N' } },
  { id: 'm_sn8', text: '새로운 것을 배울 때?',
    optionA: { label: '🧱 기초부터 차근차근 단계별로 배운다', dim: 'S' },
    optionB: { label: '🚀 전체 개념을 파악하고 나중에 세부사항을 채운다', dim: 'N' } },
  { id: 'm_sn9', text: '내가 관심을 갖는 것은?',
    optionA: { label: '🔎 실제로 존재하는 것, 현실적인 것들', dim: 'S' },
    optionB: { label: '💡 아직 존재하지 않는 것, 미래의 가능성', dim: 'N' } },
  { id: 'm_sn10', text: '대화 중 친구가 새로운 아이디어를 말했을 때?',
    optionA: { label: '🤔 "그게 실제로 가능해? 현실적으로 봐야지"', dim: 'S' },
    optionB: { label: '🌈 "오! 그거 재밌겠다. 이렇게 발전시키면 어떨까?"', dim: 'N' } },
  { id: 'm_sn11', text: '정보를 받아들이는 방식은?',
    optionA: { label: '📸 오감으로 느끼는 것, 구체적인 것들을 신뢰한다', dim: 'S' },
    optionB: { label: '🔮 패턴이나 뒤에 숨은 의미를 먼저 파악한다', dim: 'N' } },
  { id: 'm_sn12', text: '회의에서 아이디어 제안 시?',
    optionA: { label: '📊 검증된 방법, 과거 성공 사례 기반으로 제안', dim: 'S' },
    optionB: { label: '💭 아직 해본 적 없는 새로운 방식을 제안하고 싶다', dim: 'N' } },
  { id: 'm_sn13', text: '내가 즐기는 대화 스타일은?',
    optionA: { label: '🗣️ 실제 있었던 일, 경험, 사실을 이야기하는 것', dim: 'S' },
    optionB: { label: '🌀 가설, 철학적 질문, 만약 ~라면 이야기', dim: 'N' } },

  // ─── T vs F (13문항) ───
  { id: 'm_tf1', text: '친구가 "나 이거 어때 보여?"라고 물을 때?',
    optionA: { label: '💬 솔직하게 의견을 말한다 (들으라고 물은 거잖아)', dim: 'T' },
    optionB: { label: '🥰 일단 기분 맞춰주고 조심스럽게 이야기한다', dim: 'F' } },
  { id: 'm_tf2', text: '누군가 나에게 상처 주는 말을 했을 때?',
    optionA: { label: '🧮 "왜 그런 말을 했는지" 논리를 분석한다', dim: 'T' },
    optionB: { label: '😢 일단 감정이 먼저 터진다', dim: 'F' } },
  { id: 'm_tf3', text: '팀 프로젝트에서 의견 충돌이 생겼을 때?',
    optionA: { label: '⚖️ 합리적으로 옳은 방향으로 밀어붙인다', dim: 'T' },
    optionB: { label: '🤝 팀 분위기와 모두의 감정을 먼저 챙긴다', dim: 'F' } },
  { id: 'm_tf4', text: '영화를 보다 슬픈 장면이 나왔을 때?',
    optionA: { label: '🎬 "이 장면이 전체 스토리에서 어떤 의미인지" 분석한다', dim: 'T' },
    optionB: { label: '😭 나도 모르게 눈물이 나온다', dim: 'F' } },
  { id: 'm_tf5', text: '친구가 실수를 했을 때?',
    optionA: { label: '📋 왜 그 실수가 생겼는지 원인을 파악하고 해결책을 찾는다', dim: 'T' },
    optionB: { label: '🫂 먼저 "많이 힘들겠다"고 위로한다', dim: 'F' } },
  { id: 'm_tf6', text: '중요한 결정을 내릴 때?',
    optionA: { label: '🧠 장단점을 비교하고 논리적으로 최선을 선택한다', dim: 'T' },
    optionB: { label: '💗 결정이 나와 주변 사람에게 어떤 영향을 미칠지 먼저 생각한다', dim: 'F' } },
  { id: 'm_tf7', text: '토론할 때 나는?',
    optionA: { label: '⚔️ 논리적으로 틀린 부분은 지적하고 반박한다', dim: 'T' },
    optionB: { label: '🕊️ 상대방의 감정을 상하게 하지 않으면서 의견을 전달한다', dim: 'F' } },
  { id: 'm_tf8', text: '칭찬을 받으면?',
    optionA: { label: '🎯 "어떤 점이 좋았는지" 구체적인 피드백이 더 유용하다', dim: 'T' },
    optionB: { label: '🌸 칭찬 자체가 기분 좋고 에너지가 충전된다', dim: 'F' } },
  { id: 'm_tf9', text: '친구가 잘못된 결정을 했을 때?',
    optionA: { label: '📣 솔직하게 "그 결정은 좋지 않아"라고 말해준다', dim: 'T' },
    optionB: { label: '🤐 친구가 원하지 않으면 굳이 말하지 않는다', dim: 'F' } },
  { id: 'm_tf10', text: '업무 피드백을 줄 때?',
    optionA: { label: '📝 개선점 위주로 솔직하고 직접적으로 전달한다', dim: 'T' },
    optionB: { label: '💌 잘한 점 먼저 언급하고 부드럽게 개선점을 전달한다', dim: 'F' } },
  { id: 'm_tf11', text: '의견 불일치 상황에서?',
    optionA: { label: '🔬 감정보다 사실과 논리로 대화한다', dim: 'T' },
    optionB: { label: '🌊 분위기가 좋아야 이야기가 잘 풀린다', dim: 'F' } },
  { id: 'm_tf12', text: '큰 결정을 앞두고 "이게 맞는 선택이야?"라는 걱정이 들 때?',
    optionA: { label: '📊 논리적으로 분석해서 확인하면 마음이 놓인다', dim: 'T' },
    optionB: { label: '❤️ 가까운 사람의 공감과 지지가 있어야 마음이 놓인다', dim: 'F' } },
  { id: 'm_tf13', text: '비판을 받았을 때?',
    optionA: { label: '🛡️ 감정은 나중에, 먼저 비판의 타당성을 판단한다', dim: 'T' },
    optionB: { label: '💔 논리보다 비판의 방식이 상처가 될 수 있다', dim: 'F' } },

  // ─── J vs P (13문항) ───
  { id: 'm_jp1', text: '할 일 목록(to-do)에 대한 나의 자세?',
    optionA: { label: '✅ 목록 있음, 순서대로, 완료 체크 최고', dim: 'J' },
    optionB: { label: '🌀 대충 머릿속에, 생각나면 한다', dim: 'P' } },
  { id: 'm_jp2', text: '마감 기한이 있는 과제?',
    optionA: { label: '⏰ 미리 다 해두고 여유 있게 제출', dim: 'J' },
    optionB: { label: '🔥 마감 직전 집중 폭발 모드 (마감이 친구)', dim: 'P' } },
  { id: 'm_jp3', text: '갑작스러운 계획 변경이 생겼을 때?',
    optionA: { label: '😤 당황스럽다. 계획이 틀어지면 불편하다', dim: 'J' },
    optionB: { label: '🙆 오히려 좋아? 유연하게 대처한다', dim: 'P' } },
  { id: 'm_jp4', text: '방이나 책상이?',
    optionA: { label: '📐 물건마다 자리가 정해져 있고 정리되어 있다', dim: 'J' },
    optionB: { label: '🌪️ 나름의 질서가 있지만 남들 눈엔 어지럽다', dim: 'P' } },
  { id: 'm_jp5', text: '여러 선택지가 있을 때?',
    optionA: { label: '🎯 빠르게 결정하고 앞으로 나아가는 게 좋다', dim: 'J' },
    optionB: { label: '🔄 가능한 한 많은 옵션을 열어두고 싶다', dim: 'P' } },
  { id: 'm_jp6', text: '여행 중 예상치 못한 일이 생겼을 때?',
    optionA: { label: '📋 빠르게 대안 계획을 세운다', dim: 'J' },
    optionB: { label: '🌊 그냥 흐름에 맡기고 즐긴다', dim: 'P' } },
  { id: 'm_jp7', text: '약속 시간에 대한 나의 태도?',
    optionA: { label: '⏱️ 항상 여유 있게 미리 도착한다', dim: 'J' },
    optionB: { label: '😅 거의 정시 또는 약간 늦게, 빡빡하게 도착한다', dim: 'P' } },
  { id: 'm_jp8', text: '쇼핑을 할 때?',
    optionA: { label: '🛒 살 것 목록을 미리 작성하고 계획대로 산다', dim: 'J' },
    optionB: { label: '🛍️ 눈에 띄는 것, 마음에 드는 것을 즉흥으로 산다', dim: 'P' } },
  { id: 'm_jp9', text: '한 주를 어떻게 시작하나요?',
    optionA: { label: '📅 주간 계획을 미리 세우고 일정을 정리한다', dim: 'J' },
    optionB: { label: '🌅 그냥 시작하고 흘러가는 대로 본다', dim: 'P' } },
  { id: 'm_jp10', text: '결정을 내릴 때?',
    optionA: { label: '✔️ 한 번 결정하면 바꾸기 싫다', dim: 'J' },
    optionB: { label: '🔁 상황이 바뀌면 언제든 바꿀 수 있다고 생각한다', dim: 'P' } },
  { id: 'm_jp11', text: '일이 정해진 순서대로 안 풀릴 때?',
    optionA: { label: '😟 스트레스가 쌓이고 마음이 불편하다', dim: 'J' },
    optionB: { label: '🤷 어떻게든 되겠지, 융통성 있게 넘어간다', dim: 'P' } },
  { id: 'm_jp12', text: '일 vs 놀이 스타일은?',
    optionA: { label: '💼 일 다 끝내고 놀아야 마음이 편하다', dim: 'J' },
    optionB: { label: '🎮 일하다가 놀고, 놀다가 일하고 섞이는 게 편하다', dim: 'P' } },
  { id: 'm_jp13', text: '오늘 해야 할 일이 있을 때?',
    optionA: { label: '📌 아침에 할 일 목록을 정하고 하나씩 처리한다', dim: 'J' },
    optionB: { label: '🌊 에너지가 생기는 순서대로 즉흥으로 처리한다', dim: 'P' } },
];

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

const MBTI_RESULTS: Record<string, {
  emoji: string; title: string; summary: string; traits: string[];
  doToday: string; avoidToday: string;
  visual: { emojis: string[]; gradient: string };
}> = {
  INTJ: { emoji: '🧠', title: 'INTJ — 전략가', summary: '독립적이고 분석적. 세상을 체스판처럼 봅니다. 믿는 사람은 몇 명 없지만 그게 맞다고 생각함.', traits: ['전략적', '독립적', '냉철'], doToday: '장기 계획을 구체적으로 정리해보세요', avoidToday: '감정적인 상황에서 즉각 반응하지 마세요', visual: { emojis: ['🧠', '♟️', '🌑'], gradient: 'from-slate-600 to-gray-700' } },
  INTP: { emoji: '🔬', title: 'INTP — 논리학자', summary: '호기심과 분석력이 넘칩니다. "왜?"라는 질문이 삶의 동력. 머릿속은 항상 바쁘지만 겉은 조용함.', traits: ['논리적', '호기심', '분석가'], doToday: '관심 있는 주제 하나를 깊이 파고들어보세요', avoidToday: '완벽한 계획을 기다리다 아무것도 못 하지 마세요', visual: { emojis: ['🔬', '🔭', '💡'], gradient: 'from-blue-600 to-indigo-700' } },
  ENTJ: { emoji: '👑', title: 'ENTJ — 지휘관', summary: '타고난 리더. 목표를 향해 직진하며 비효율을 참지 못함. 말보다 실행, 실행보다 결과.', traits: ['리더십', '결단력', '목표지향'], doToday: '중요한 일 하나를 오늘 바로 실행에 옮기세요', avoidToday: '혼자 다 하려다 팀원을 소외시키지 마세요', visual: { emojis: ['👑', '⚡', '🦅'], gradient: 'from-amber-500 to-orange-600' } },
  ENTP: { emoji: '💡', title: 'ENTP — 발명가', summary: '아이디어 공장. 토론을 즐기고 규칙보다 가능성을 봅니다. 지루한 걸 가장 못 견딤.', traits: ['창의적', '논쟁적', '혁신적'], doToday: '새로운 아이디어를 메모해두고 하나 실험해보세요', avoidToday: '시작만 하고 마무리를 못 짓는 패턴을 의식하세요', visual: { emojis: ['💡', '🔥', '🎲'], gradient: 'from-yellow-500 to-orange-500' } },
  INFJ: { emoji: '🌌', title: 'INFJ — 예언자', summary: '드물고 깊습니다. 사람을 잘 읽고 이상을 추구하며 혼자 있는 시간이 꼭 필요한 타입.', traits: ['통찰력', '이상주의', '공감'], doToday: '자신의 가치관에 맞는 일을 하나 해보세요', avoidToday: '모든 사람을 구하려다 스스로 지치지 마세요', visual: { emojis: ['🌌', '✨', '🔮'], gradient: 'from-indigo-600 to-purple-700' } },
  INFP: { emoji: '🦋', title: 'INFP — 중재자', summary: '감수성이 풍부하고 자신만의 세계가 있습니다. 착하지만 뒤에서 많이 상처받는 유형.', traits: ['감수성', '이상주의', '창의적'], doToday: '오늘 하루 느낀 감정을 글로 써보세요', avoidToday: '자기 자신을 너무 가혹하게 대하지 마세요', visual: { emojis: ['🦋', '🌸', '🌙'], gradient: 'from-pink-400 to-purple-500' } },
  ENFJ: { emoji: '🌟', title: 'ENFJ — 주인공', summary: '사람들을 이끌고 영감을 줍니다. 모두가 잘 되길 바라는 진심 어린 응원단장.', traits: ['카리스마', '공감', '리더십'], doToday: '주변 사람에게 진심 어린 격려의 말을 전해보세요', avoidToday: '남을 돕느라 자신을 돌보는 걸 잊지 마세요', visual: { emojis: ['🌟', '🤗', '☀️'], gradient: 'from-yellow-400 to-orange-400' } },
  ENFP: { emoji: '🎨', title: 'ENFP — 활동가', summary: '열정 폭발, 가능성 탐험가. 새로운 것에 흥분하고 사람에게 에너지를 받는 자유로운 영혼.', traits: ['열정적', '자유로운', '창의적'], doToday: '한 가지를 끝까지 마무리해보는 연습을 해보세요', avoidToday: '너무 많은 것을 동시에 시작하지 마세요', visual: { emojis: ['🎨', '🌈', '🦄'], gradient: 'from-fuchsia-500 to-pink-500' } },
  ISTJ: { emoji: '📋', title: 'ISTJ — 현실주의자', summary: '믿음직하고 철저합니다. 약속을 지키고 계획대로 사는 것이 행복. 맡은 일은 반드시 완수함.', traits: ['신뢰성', '체계적', '성실함'], doToday: '오늘의 할 일을 목록으로 만들고 하나씩 체크하세요', avoidToday: '변화를 무조건 거부하지 말고 한 번은 시도해보세요', visual: { emojis: ['📋', '🛡️', '⚙️'], gradient: 'from-slate-500 to-blue-600' } },
  ISFJ: { emoji: '🛡️', title: 'ISFJ — 수호자', summary: '조용한 영웅. 남을 위해 헌신하고 배려하지만 자기 공을 드러내지 않는 든든한 존재.', traits: ['배려심', '헌신적', '책임감'], doToday: '오늘은 자신을 위한 것을 하나 해보세요', avoidToday: '"아니오"라고 말하는 연습이 필요합니다', visual: { emojis: ['🛡️', '🌿', '💙'], gradient: 'from-teal-500 to-cyan-600' } },
  ESTJ: { emoji: '⚙️', title: 'ESTJ — 경영자', summary: '체계와 질서를 사랑합니다. 규칙이 있어야 안심되고 효율이 없으면 답답한 실용주의자.', traits: ['체계적', '실용적', '리더십'], doToday: '팀의 목표를 명확하게 공유해보세요', avoidToday: '자신의 방식만이 옳다는 고집을 내려놓아보세요', visual: { emojis: ['⚙️', '📊', '🏗️'], gradient: 'from-gray-500 to-slate-600' } },
  ESFJ: { emoji: '🤗', title: 'ESFJ — 집정관', summary: '따뜻하고 사교적. 모두가 행복하길 바라며 분위기를 챙기는 모임의 윤활유 같은 존재.', traits: ['사교적', '배려', '조화'], doToday: '소중한 사람에게 먼저 연락해보세요', avoidToday: '남의 평가를 지나치게 신경쓰지 마세요', visual: { emojis: ['🤗', '💛', '🌻'], gradient: 'from-yellow-400 to-amber-500' } },
  ISTP: { emoji: '🔧', title: 'ISTP — 장인', summary: '말보다 행동. 이론보다 실험. 문제가 생기면 직접 뜯어보고 고치는 쿨한 현실주의자.', traits: ['현실적', '독립적', '분석적'], doToday: '오늘 손으로 직접 무언가를 해보세요', avoidToday: '감정 표현을 너무 닫아두지 마세요', visual: { emojis: ['🔧', '⚡', '🎯'], gradient: 'from-stone-500 to-gray-600' } },
  ISFP: { emoji: '🌸', title: 'ISFP — 모험가', summary: '조용하지만 자신만의 감성이 뚜렷합니다. 아름다운 것을 사랑하고 자유를 소중히 여김.', traits: ['감성적', '자유로운', '예술적'], doToday: '오늘 당신의 감성을 표현할 방법을 찾아보세요', avoidToday: '결정을 너무 오래 미루지 마세요', visual: { emojis: ['🌸', '🍃', '🎵'], gradient: 'from-rose-400 to-pink-500' } },
  ESTP: { emoji: '⚡', title: 'ESTP — 사업가', summary: '행동하면서 생각하는 타입. 이론보다 경험, 계획보다 즉흥. 위기 상황에서 가장 빛남.', traits: ['행동력', '적응력', '즉흥적'], doToday: '지금 당장 가능한 것을 하나 실행해보세요', avoidToday: '장기적 결과를 고려하지 않고 돌진하지 마세요', visual: { emojis: ['⚡', '🏎️', '🔥'], gradient: 'from-red-500 to-orange-500' } },
  ESFP: { emoji: '🎉', title: 'ESFP — 연예인', summary: '삶 자체가 파티. 에너지 넘치고 즉흥적이며 지금 이 순간을 즐기는 것이 최우선.', traits: ['활발함', '즐거움', '즉흥적'], doToday: '오늘 하루를 즐겁게 보낼 계획을 세워보세요', avoidToday: '중요한 것을 즐거움 때문에 미루지 마세요', visual: { emojis: ['🎉', '🎊', '✨'], gradient: 'from-pink-400 to-fuchsia-500' } },
};

export default function MBTIRunner() {
  // 차원별 랜덤 3문항 선택 (마운트 시 한 번만)
  const questions = useMemo(() => {
    const seed = Date.now() ^ (Math.random() * 0xffffffff);
    const dims: [Dim, Dim][] = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']];
    const result: MBTIQuestion[] = [];
    dims.forEach(([a, b]) => {
      const pool = ALL_QUESTIONS.filter(q => q.optionA.dim === a || q.optionA.dim === b);
      result.push(...shuffleWithSeed(pool, seed ^ pool.length).slice(0, 3));
    });
    return result;
  }, []);

  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<Dim, number>>({ E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 });
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  const q = questions[current];
  const handleChoice = (choice: 'a' | 'b') => {
    if (selected) return;
    setSelected(choice);
    const dim = choice === 'a' ? q.optionA.dim : q.optionB.dim;
    setScores(prev => ({ ...prev, [dim]: prev[dim] + 1 }));

    setTimeout(() => {
      if (current + 1 >= questions.length) setFinished(true);
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
        { area: 'traits', label: '핵심 특성', emoji: '✨', text: r.traits.join(' · ') },
        { area: 'tip',    label: '오늘의 제안', emoji: '💡', text: r.doToday },
      ],
      personalDetail: `12개 상황 질문 결과 당신은 ${mbtiType} 성향이 가장 강하게 나왔습니다.`,
      shareCard: {
        title: `MBTI 상황 테스트 결과: ${mbtiType} ${r.title.split(' — ')[1] ?? ''}`,
        summary: r.summary,
        keywords: [mbtiType, ...r.traits.slice(0, 2)],
      },
      meta: { disclaimer: true, generatedAt: new Date().toISOString().slice(0, 10) },
    };

    return (
      <div className="space-y-4">
        <div className={`bg-gradient-to-br ${r.visual.gradient} rounded-2xl p-8 text-center shadow-lg`}>
          <div className="flex justify-center gap-3 mb-3">
            {r.visual.emojis.map((em, i) => (
              <span key={i} className="text-5xl">{em}</span>
            ))}
          </div>
          <div className="text-3xl font-black text-white mb-1">{mbtiType}</div>
          <h2 className="text-lg font-bold text-white/90">{r.title.split(' — ')[1]}</h2>
        </div>
        <ResultView result={output} slug="mbti-situation" />
      </div>
    );
  }

  const pct = Math.round((current / questions.length) * 100);
  const dimLabels = ['E/I 외향·내향', 'E/I 외향·내향', 'E/I 외향·내향', 'S/N 감각·직관', 'S/N 감각·직관', 'S/N 감각·직관', 'T/F 사고·감정', 'T/F 사고·감정', 'T/F 사고·감정', 'J/P 계획·즉흥', 'J/P 계획·즉흥', 'J/P 계획·즉흥'];
  const dimLabel = dimLabels[current] ?? '';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-gray-400 font-medium">{current + 1}/{questions.length}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
          📐 {dimLabel}
        </span>
      </div>

      <div key={current} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p className="text-base font-bold text-gray-900 mb-5 leading-snug">{q.text}</p>
        <div className="space-y-3">
          {(['a', 'b'] as const).map((choice) => {
            const opt = choice === 'a' ? q.optionA : q.optionB;
            const isSelected = selected === choice;
            const isOther = selected !== null && selected !== choice;
            return (
              <button key={choice} onClick={() => handleChoice(choice)} disabled={!!selected}
                className={`w-full text-left px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  isSelected ? 'border-violet-500 bg-violet-50 text-violet-900' :
                  isOther ? 'border-gray-100 text-gray-300' :
                  'border-gray-200 text-gray-700 hover:border-violet-300 hover:bg-violet-50 active:scale-[0.98]'
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
