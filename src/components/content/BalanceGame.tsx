'use client';

import { useState, useMemo } from 'react';
import ResultView from './ResultView';
import { GenerateResultOutput } from '@/engine/types';

const HELL_QUESTIONS = [
  { id: 'hq1',  a: '😤 똥맛 카레 먹기',                    b: '💩 카레맛 똥 먹기' },
  { id: 'hq2',  a: '👔 전 애인과 한 직장 다니기',            b: '🏠 전 애인 부모님과 한집 살기' },
  { id: 'hq3',  a: '💬 말할 때마다 방귀 소리 나기',          b: '🚶 걸을 때마다 뽁뽁이 소리 나기' },
  { id: 'hq4',  a: '📵 유튜브 광고 평생 스킵 불가',          b: '📴 카톡 읽씹 여부 평생 확인 불가' },
  { id: 'hq5',  a: '✈️ 평생 비행기 중간 좌석만',             b: '🚇 평생 출퇴근 지하철만 이용' },
  { id: 'hq6',  a: '🌙 새벽 3시에만 입맛 폭발',              b: '🍽️ 평생 혼자서만 밥 먹기' },
  { id: 'hq7',  a: '📲 내 카톡 대화 전부 공개',              b: '🎥 내 모든 흑역사 영상 공개' },
  { id: 'hq8',  a: '🪫 폰 배터리 항상 3%',                  b: '🔌 폰 항상 충전 중인데 22%' },
  { id: 'hq9',  a: '🛏️ 잘 때마다 베개가 떡이 됨',            b: '🪑 앉을 때마다 뜨거운 음료 엎질러진 의자' },
  { id: 'hq10', a: '⏰ 매일 출근 10분 전에 깨기',            b: '😴 매일 밤 배 불러서 못 자기' },
  { id: 'hq11', a: '🐛 SNS에 벌레 광고만 뜨기',              b: '🕵️ 내 검색 기록 가족 단톡방 공개' },
  { id: 'hq12', a: '🍜 라면 먹을 때마다 냄비 설거지',        b: '📦 배달마다 용기 씻어서 분리수거' },
  { id: 'hq13', a: '⏪ 수능 다시 보기',                      b: '⏩ 지금부터 10년 점프 (돌이킬 수 없음)' },
  { id: 'hq14', a: '🦶 평생 맨발로만 살기',                  b: '🧤 평생 장갑 끼고만 살기' },
  { id: 'hq15', a: '👻 내 모든 취향 공개',                   b: '💀 내 전 연인들이 친목 모임 가짐' },
  { id: 'hq16', a: '🦷 평생 양치 없이',                      b: '🚿 평생 샤워 없이' },
  { id: 'hq17', a: '🎵 내가 말할 때마다 도레미파솔라시도 나옴', b: '😂 내가 웃을 때마다 방귀소리 나옴' },
  { id: 'hq18', a: '💭 내 모든 생각이 주변 사람에게 들림',   b: '👂 주변 모든 사람의 생각이 내 귀에 들림' },
  { id: 'hq19', a: '🍜 평생 라면 없이',                      b: '☕ 평생 카페 없이' },
  { id: 'hq20', a: '🪲 눈에 안 보이는 모기 방 안에',         b: '🪰 잡히지 않는 파리 방 안에' },
  { id: 'hq21', a: '🌞 평생 혼자 점심',                      b: '👤 평생 모르는 사람과 합석' },
  { id: 'hq22', a: '📱 카카오톡 사라짐',                     b: '▶️ 유튜브 사라짐' },
  { id: 'hq23', a: '🎵 평생 하나의 노래만 들을 수 있음',     b: '🔇 평생 아무 음악도 못 들음' },
  { id: 'hq24', a: '📦 배달앱 사라짐',                       b: '💸 배달비 만 원으로 고정' },
  { id: 'hq25', a: '😢 잠들기 5분 전 항상 울기',             b: '😄 아침에 5분 동안 억지로 웃기' },
  { id: 'hq26', a: '🍞 평생 치즈 없는 피자',                  b: '🥪 평생 땅콩버터 없는 샌드위치' },
  { id: 'hq27', a: '📵 화면이 30분마다 무조건 꺼짐',          b: '⏱️ 폰을 하루 30분만 쓸 수 있음' },
  { id: 'hq28', a: '🚪 모든 문이 낮아서 항상 고개 숙여야 함', b: '🪑 모든 의자가 높아서 발이 항상 떠 있음' },
  { id: 'hq29', a: '😂 누군가 나를 보면 이유 없이 웃음',     b: '😭 누군가 나를 보면 이유 없이 눈물' },
  { id: 'hq30', a: '📺 최애 드라마 시즌 1에서 끝남',         b: '📺 최애 드라마 20시즌인데 마지막 시즌 쓰레기' },
  { id: 'hq31', a: '🍱 먹고 싶은 음식 생각하면 10인분 나옴', b: '🥢 어떤 음식이든 한 입만 먹을 수 있음' },
  { id: 'hq32', a: '🤝 악수할 때마다 상대 나이를 외쳐야 함', b: '👀 눈 마주칠 때마다 상대 이름을 맞춰야 함' },
  { id: 'hq33', a: '📸 사진 찍을 때 항상 눈을 감음',         b: '😮 사진 찍을 때 항상 입이 벌어짐' },
  { id: 'hq34', a: '❄️ 평생 겨울',                           b: '☀️ 평생 여름' },
  { id: 'hq35', a: '⏰ 무조건 30분 일찍 도착',               b: '⌛ 무조건 30분 늦게 도착' },
  { id: 'hq36', a: '📱 내가 쓴 모든 문자가 공개됨',          b: '🛒 내 구매 내역이 모두 공개됨' },
  { id: 'hq37', a: '🌶️ 매운 걸 먹을 때마다 울어야 함',       b: '👏 맛있는 걸 먹을 때마다 박수 쳐야 함' },
  { id: 'hq38', a: '🙏 말할 때마다 "저는 이렇게 생각하는데요~" 붙여야 함', b: '🤔 말할 때마다 "아닌가요?"로 끝내야 함' },
  { id: 'hq39', a: '📵 내가 보낸 메시지 전부 읽씹만 옴',    b: '🤪 내 메시지엔 답 오지만 주제와 상관없는 내용' },
  { id: 'hq40', a: '🍕 평생 맵고 짠 음식만',                 b: '🍰 평생 달고 느끼한 음식만' },
  { id: 'hq41', a: '🎤 갑자기 아무때나 노래를 불러야 함 (하루 3번)', b: '💃 갑자기 아무때나 춤을 춰야 함 (하루 3번)' },
  { id: 'hq42', a: '💤 항상 잠이 너무 많이 와서 졸림',       b: '😵 항상 잠이 전혀 안 와서 잠 못 잠' },
  { id: 'hq43', a: '🌧️ 외출할 때마다 비가 옴',              b: '☀️ 집에 있을 때만 좋은 날씨' },
  { id: 'hq44', a: '🐟 평생 고기 없이',                      b: '🥩 평생 해산물 없이' },
  { id: 'hq45', a: '🚫 내 이름이 영원히 "아무개"로 바뀜',   b: '🤡 평생 파티용 코 빨간 코 착용' },
  { id: 'hq46', a: '💸 지금 가진 돈이 두 배가 되지만 기억력이 반으로 줌', b: '🧠 지금 가진 기억력이 두 배가 되지만 돈이 반으로 줌' },
  { id: 'hq47', a: '🐕 평생 개 알레르기',                    b: '🐈 평생 고양이 알레르기' },
  { id: 'hq48', a: '🛁 평생 샤워만 가능 (욕조 없음)',        b: '🚿 평생 욕조만 가능 (샤워기 없음)' },
  { id: 'hq49', a: '📚 평생 전자책만',                       b: '📱 평생 종이책만' },
  { id: 'hq50', a: '🎮 평생 게임 없이',                      b: '📺 평생 TV·스트리밍 없이' },
];

const MORAL_QUESTIONS = [
  { id: 'mq1',  a: '🚃 5명을 살리기 위해 트롤리 방향을 바꿔 무고한 1명을 희생시킨다', b: '🙈 1명의 죽음을 막기 위해 5명이 죽는 것을 그냥 둔다' },
  { id: 'mq2',  a: '💊 불치병 환자가 안락사를 원할 때 의사로서 도와준다', b: '🏥 고통스럽더라도 자연적으로 임종을 기다린다' },
  { id: 'mq3',  a: '🤥 선의의 거짓말로 상대방을 행복하게 한다', b: '💬 어떤 상황에서도 진실을 말한다' },
  { id: 'mq4',  a: '💰 부자에게서 훔쳐 더 가난한 사람을 도운다 (로빈후드)', b: '⚖️ 아무리 선한 이유여도 훔치는 것은 나쁘다' },
  { id: 'mq5',  a: '🌍 10명의 낯선 사람을 구하기 위해 내 가족 1명을 희생한다', b: '❤️ 가족은 무슨 일이 있어도 지킨다' },
  { id: 'mq6',  a: '🧒 과거에 끔찍한 범죄를 저지를 사람이 어린이일 때 막기 위해 해를 가한다', b: '⚖️ 아직 죄를 짓지 않은 사람에게 해를 가하는 것은 옳지 않다' },
  { id: 'mq7',  a: '🌲 동물 실험이 인간의 목숨을 구할 수 있다면 허용해야 한다', b: '🐭 어떤 이유로도 동물에게 고통을 주는 것은 잘못이다' },
  { id: 'mq8',  a: '🗳️ 사회 전체의 행복을 위해 개인의 자유를 어느 정도 제한할 수 있다', b: '🆓 개인의 자유는 어떤 경우에도 침해될 수 없다' },
  { id: 'mq9',  a: '📰 공익을 위한 정보라면 개인의 사생활 침해도 정당화된다', b: '🔒 어떤 이유로도 개인의 사생활은 보호받아야 한다' },
  { id: 'mq10', a: '🌏 지금 세대의 이익을 위해 미래 세대에게 부담을 넘길 수 있다', b: '🌱 현세대는 미래 세대를 위해 희생할 의무가 있다' },
  { id: 'mq11', a: '🤖 AI가 사람보다 더 공정한 결정을 내린다면 판사를 AI로 교체해야 한다', b: '👨‍⚖️ 생사여탈권은 반드시 인간이 가져야 한다' },
  { id: 'mq12', a: '🏚️ 사회는 노력하지 않은 사람도 기본 생활을 보장해줘야 한다', b: '💼 사회는 노력한 사람에게만 더 많은 보상을 줘야 한다' },
  { id: 'mq13', a: '🧬 유전자 편집으로 태어날 아이의 병을 미리 없애는 것은 옳다', b: '🌿 생명의 자연적 과정에 인위적으로 개입하면 안 된다' },
  { id: 'mq14', a: '🎭 예술은 어떤 내용이라도 표현의 자유로 보장되어야 한다', b: '🚫 사회에 해를 끼칠 수 있는 예술은 규제해야 한다' },
  { id: 'mq15', a: '🏛️ 역사적 과오를 저지른 국가는 후손이라도 배상 책임이 있다', b: '📖 현세대는 전 세대의 잘못에 법적 책임이 없다' },
  { id: 'mq16', a: '💉 공중 보건을 위해 백신 접종을 의무화할 수 있다', b: '🙋 의료 결정은 개인의 자유 의지에 달려있다' },
  { id: 'mq17', a: '🐾 반려동물을 입양하면 평생 책임져야 하므로 충동 입양은 범죄에 해당해야 한다', b: '🤷 반려동물 문제는 법이 아닌 개인 도덕의 영역이다' },
  { id: 'mq18', a: '💻 해킹으로 정부 부패를 밝힌 내부고발자는 영웅이다', b: '🔐 어떤 이유에서든 무단 해킹은 범죄다' },
  { id: 'mq19', a: '🌊 기후 위기를 막기 위해 선진국은 경제 성장을 멈춰야 한다', b: '📈 기후 대응보다 경제 성장이 더 많은 사람을 구한다' },
  { id: 'mq20', a: '🏋️ 스스로에게만 해가 되는 선택(마약, 도박 등)은 개인이 결정할 수 있어야 한다', b: '⚕️ 사회는 개인이 자신에게 해로운 선택을 하지 못하도록 막을 수 있다' },
  { id: 'mq21', a: '🤔 지능이 매우 높은 사람이 낮은 사람을 속여 이득을 취해도 진화론적으로 허용된다', b: '❌ 지능의 차이는 착취를 정당화하지 않는다' },
  { id: 'mq22', a: '🌎 국경은 없어지고 모든 인간이 자유롭게 이동할 수 있어야 한다', b: '🗺️ 국가는 자국민을 보호하기 위해 국경을 통제할 권리가 있다' },
  { id: 'mq23', a: '⚔️ 침략자로부터 나라를 지키기 위해 전쟁은 정당화된다', b: '☮️ 어떤 이유로도 전쟁으로 인한 생명 희생은 정당화될 수 없다' },
  { id: 'mq24', a: '🏆 결과가 좋다면 과정에서의 비윤리적 수단도 정당화된다', b: '🚶 결과와 상관없이 윤리적 과정이 더 중요하다' },
  { id: 'mq25', a: '💡 당신의 삶에서 가장 중요한 것은 자신의 행복이다', b: '❤️ 당신의 삶에서 가장 중요한 것은 타인을 위한 기여다' },
];

type ResultType = {
  emoji: string; title: string; summary: string; describe: string;
  traits: string[]; doToday: string; avoidToday: string;
  visual: { emojis: string[]; gradient: string };
};

const HELL_RESULTS: ResultType[] = [
  {
    emoji: '🕊️', title: 'B형 현실주의자',
    summary: 'B를 선호하는 당신은 냉철한 판단을 합니다',
    describe: 'B를 많이 골랐군요. 현실적 판단력이 탁월합니다. 고통보다 타협을 선택하는 지혜로운 삶. (주의: 이 사람 옆에 있으면 갑자기 합리적인 말을 들을 수 있음)',
    traits: ['현실주의', '냉철함', '타협의 달인'],
    doToday: '오늘도 합리적인 선택을 하세요. 당신의 강점입니다.',
    avoidToday: '너무 계산적으로 굴면 재미없어 보일 수 있어요',
    visual: { emojis: ['🕊️', '🧊', '⚖️'], gradient: 'from-blue-400 to-cyan-500' },
  },
  {
    emoji: '🤷', title: '균형형 생존자',
    summary: '어떤 지옥이든 버틸 준비가 된 당신',
    describe: '뭐가 더 나쁜지 재는 데 시간이 걸렸죠? 신중하고 균형 잡힌 판단을 하는 타입. 어떤 상황에서도 살아남을 것 같은 느낌이 납니다.',
    traits: ['균형감', '신중함', '생존력'],
    doToday: '어떤 선택이든 후회하지 않을 자신이 있으면 그게 맞는 선택입니다.',
    avoidToday: '너무 오래 고민하다 기회를 놓치지 마세요',
    visual: { emojis: ['🤷', '⚖️', '🎭'], gradient: 'from-green-400 to-teal-500' },
  },
  {
    emoji: '😤', title: '소신파 A선택자',
    summary: 'A를 많이 골랐지만 거기엔 당신만의 논리가 있습니다',
    describe: 'A를 많이 골랐지만 소신이 있습니다. 남들이 이해 못 해도 당신의 판단엔 당신만의 논리가 있어요. 그게 맞는지는... 음.',
    traits: ['소신', '독특한 논리', '개성'],
    doToday: '당신의 독특한 관점을 두려워하지 마세요. 그게 매력입니다.',
    avoidToday: '너무 A만 고집하다 진짜 중요한 것을 놓치지 마세요',
    visual: { emojis: ['😤', '🔥', '💪'], gradient: 'from-orange-400 to-amber-500' },
  },
  {
    emoji: '🔥', title: '자가고문 수집가',
    summary: '왜 더 힘든 걸 고르셨나요? 걱정됩니다',
    describe: 'A를 자주 고른 당신, 스스로 힘든 길을 선택하는 경향이 있어요. 이미 많은 고통을 경험해서 감각이 무뎌진 걸까요? 아 잠깐, 주변이 도망가고 없겠구나.',
    traits: ['고통 내성', '자기고문', '경험치 만렙'],
    doToday: '오늘만큼은 편한 것을 선택해보세요. 당신도 행복할 자격이 있습니다.',
    avoidToday: '굳이 힘든 길을 찾아가지 마세요. 힘든 건 알아서 옵니다.',
    visual: { emojis: ['🔥', '💀', '🏋️'], gradient: 'from-red-500 to-orange-600' },
  },
  {
    emoji: '💀', title: '고통의 경지에 오른 자',
    summary: '전부 A... 이미 무감각해진 걸까요?',
    describe: '전부 또는 거의 A를 고르셨습니다. 당신은 이미 모든 것을 경험했거나, 진짜 무서운 분이거나 둘 중 하나입니다. 어디서든 살아남을 것 같아서 오히려 존경스럽습니다.',
    traits: ['무적 멘탈', '경험치 초월', '생존왕'],
    doToday: '당신은 이미 뭐든 견딜 수 있습니다. 오늘은 그냥 쉬세요.',
    avoidToday: '굳이 더 어렵게 살지 않아도 돼요. 이미 충분히 어렵습니다.',
    visual: { emojis: ['💀', '😈', '👑'], gradient: 'from-gray-700 to-slate-800' },
  },
];

const MORAL_RESULTS: ResultType[] = [
  {
    emoji: '❤️', title: '감정 우선 공리주의자',
    summary: 'B를 많이 선택한 당신, 감정과 공동체를 중시합니다',
    describe: 'B를 많이 선택한 당신. 규칙과 감정적 유대를 중시하는 의무론적 도덕관에 가깝습니다. 개인의 권리와 감정을 중요하게 여기며, 때로는 결과보다 과정이 더 중요하다고 느낍니다.',
    traits: ['의무론적', '감성적', '관계 중시'],
    doToday: '오늘 소중한 사람에게 먼저 연락해보세요.',
    avoidToday: '결과를 보지 않고 감정으로만 판단하지 않도록 주의하세요',
    visual: { emojis: ['❤️', '🤝', '🌿'], gradient: 'from-green-500 to-emerald-600' },
  },
  {
    emoji: '⚖️', title: '균형 잡힌 도덕 철학자',
    summary: '공리주의와 의무론 사이에서 균형을 찾는 당신',
    describe: '상황에 따라 다르게 판단하는 당신. 진정한 도덕적 지혜는 하나의 원칙만 고수하지 않고 맥락을 읽는 능력에 있습니다. 어떤 철학자도 100% 옳지 않다는 것을 본능적으로 알고 있네요.',
    traits: ['상황론적', '실용적', '균형감'],
    doToday: '오늘 한 번 반대 입장에서 생각해보는 연습을 해보세요.',
    avoidToday: '결단력 없이 계속 중립을 유지하는 것은 회피일 수 있어요',
    visual: { emojis: ['⚖️', '🎭', '🧩'], gradient: 'from-indigo-500 to-purple-600' },
  },
  {
    emoji: '🧠', title: '논리 우선 공리주의자',
    summary: 'A를 많이 선택한 당신, 결과와 최대 다수의 행복을 중시합니다',
    describe: 'A를 많이 선택한 당신. 최대 다수의 최대 행복을 추구하는 공리주의적 도덕관에 가깝습니다. 감정보다 논리, 개인보다 사회 전체의 이익을 우선시하는 경향이 있습니다.',
    traits: ['공리주의적', '논리적', '사회 중심'],
    doToday: '오늘 한 가지 결정에서 더 많은 사람에게 이로운 선택을 해보세요.',
    avoidToday: '개인의 감정과 권리를 너무 무시하지 않도록 주의하세요',
    visual: { emojis: ['🧠', '⚡', '🌍'], gradient: 'from-blue-600 to-indigo-700' },
  },
  {
    emoji: '💡', title: '자유주의적 개인주의자',
    summary: '개인의 자유와 자율성을 최우선으로 여기는 당신',
    describe: '개인의 선택과 자유를 가장 중요하게 여기는 당신. 국가나 사회의 개입보다 개인이 스스로 결정하는 것이 옳다고 생각합니다. 자유 지상주의적 철학에 가깝습니다.',
    traits: ['자유주의적', '개인주의', '자율성 중시'],
    doToday: '오늘 당신 자신을 위한 선택을 하나 해보세요.',
    avoidToday: '개인 자유의 강조가 사회적 책임을 잊게 하지 않도록 주의하세요',
    visual: { emojis: ['💡', '🦅', '🌈'], gradient: 'from-yellow-500 to-orange-500' },
  },
  {
    emoji: '🌱', title: '공동체주의적 보수주의자',
    summary: '전통과 공동체의 가치를 소중히 여기는 당신',
    describe: '변화보다 안정을, 개인보다 공동체를 중시하는 당신. 전통적인 가치와 사회적 연대를 중요하게 여기며, 급진적 변화보다는 점진적이고 신중한 접근을 선호합니다.',
    traits: ['공동체주의', '안정 추구', '전통 중시'],
    doToday: '오늘 커뮤니티나 가족을 위한 일을 해보세요.',
    avoidToday: '변화를 무조건 거부하지 말고 열린 마음을 유지하세요',
    visual: { emojis: ['🌱', '🏡', '🤝'], gradient: 'from-amber-500 to-yellow-600' },
  },
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

function getHellResult(aCount: number): ResultType {
  if (aCount <= 3)  return HELL_RESULTS[0];
  if (aCount <= 7)  return HELL_RESULTS[1];
  if (aCount <= 10) return HELL_RESULTS[2];
  if (aCount <= 14) return HELL_RESULTS[3];
  return HELL_RESULTS[4];
}

function getMoralResult(aCount: number): ResultType {
  if (aCount <= 3)  return MORAL_RESULTS[0];
  if (aCount <= 7)  return MORAL_RESULTS[1];
  if (aCount <= 10) return MORAL_RESULTS[2];
  if (aCount <= 12) return MORAL_RESULTS[3];
  return MORAL_RESULTS[4];
}

function buildOutput(aCount: number, total: number, r: ResultType, slug: string, title: string): GenerateResultOutput {
  return {
    resultKey: `balance-${slug}-${aCount}-of-${total}`,
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
    personalDetail: `A를 ${aCount}번 선택한 당신의 성향 지수는 ${Math.round((aCount / total) * 100)}% 수준입니다.`,
    shareCard: {
      title: `${title} 결과: ${r.title}`,
      summary: r.summary,
      keywords: r.traits,
    },
    meta: { disclaimer: false, generatedAt: new Date().toISOString().slice(0, 10) },
  };
}

interface Props { slug: string; }

export default function BalanceGame({ slug }: Props) {
  const isMoral = slug === 'moral-dilemma';
  const pool = isMoral ? MORAL_QUESTIONS : HELL_QUESTIONS;
  const headerText = isMoral ? '도덕 딜레마 게임' : '지옥의 선택';
  const headerColor = isMoral ? 'from-indigo-600 to-purple-700' : 'from-orange-500 to-red-600';
  const headerEmoji = isMoral ? '⚖️' : '😈';
  const barColor = isMoral ? 'from-indigo-400 to-purple-500' : 'from-orange-400 to-red-500';
  const title = isMoral ? '도덕 딜레마 게임' : '지옥의 밸런스 게임';

  const questions = useMemo(() => {
    const seed = Date.now() ^ (Math.random() * 0xffffffff);
    return shuffleWithSeed(pool, seed).slice(0, 15);
  }, [pool]);

  const [current, setCurrent] = useState(0);
  const [aCount, setACount] = useState(0);
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);
  const [finished, setFinished] = useState(false);
  const [animating, setAnimating] = useState(false);

  const q = questions[current];
  const progress = (current / questions.length) * 100;

  const handleChoice = (choice: 'a' | 'b') => {
    if (animating || selected) return;
    setSelected(choice);
    setAnimating(true);
    if (choice === 'a') setACount(prev => prev + 1);

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setFinished(true);
      } else {
        setCurrent(prev => prev + 1);
        setSelected(null);
        setAnimating(false);
      }
    }, 600);
  };

  if (finished) {
    const r = isMoral ? getMoralResult(aCount) : getHellResult(aCount);
    const result = buildOutput(aCount, questions.length, r, slug, title);
    return (
      <div className="space-y-4">
        <div className={`bg-gradient-to-br ${r.visual.gradient} rounded-2xl p-8 text-center shadow-lg`}>
          <div className="flex justify-center gap-3 mb-4">
            {r.visual.emojis.map((em, i) => (
              <span key={i} className="text-5xl">{em}</span>
            ))}
          </div>
          <h2 className="text-2xl font-black text-white mb-1">{r.title}</h2>
          <p className="text-white/80 text-sm">{r.summary}</p>
        </div>
        <ResultView result={result} slug={slug} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs text-gray-400 font-medium">{current + 1}/{questions.length}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className={`bg-gradient-to-r ${headerColor} px-5 py-3 flex items-center gap-2`}>
          <span className="text-white font-black text-sm">{headerEmoji} {headerText}</span>
          <span className="ml-auto text-white/70 text-xs">Q{current + 1}</span>
        </div>

        <div className="flex flex-col gap-0">
          <button
            onClick={() => handleChoice('a')}
            disabled={!!selected}
            className={`w-full p-6 text-left transition-all duration-300 ${
              selected === 'a' ? 'bg-orange-500 text-white scale-[0.98]' :
              selected === 'b' ? 'bg-gray-50 text-gray-300' :
              'bg-white hover:bg-orange-50 active:scale-[0.98]'
            }`}
          >
            <p className="text-[15px] font-bold leading-relaxed">{q.a}</p>
            {selected === 'a' && <p className="text-orange-100 text-xs mt-1">✓ 선택됨</p>}
          </button>

          <div className="relative h-12 flex items-center justify-center bg-gray-50 border-y border-gray-100">
            <span className="absolute bg-red-500 text-white text-sm font-black px-4 py-1 rounded-full shadow-md z-10">VS</span>
            <div className="w-full h-px bg-gray-200" />
          </div>

          <button
            onClick={() => handleChoice('b')}
            disabled={!!selected}
            className={`w-full p-6 text-left transition-all duration-300 ${
              selected === 'b' ? 'bg-purple-500 text-white scale-[0.98]' :
              selected === 'a' ? 'bg-gray-50 text-gray-300' :
              'bg-white hover:bg-purple-50 active:scale-[0.98]'
            }`}
          >
            <p className="text-[15px] font-bold leading-relaxed">{q.b}</p>
            {selected === 'b' && <p className="text-purple-100 text-xs mt-1">✓ 선택됨</p>}
          </button>
        </div>
      </div>

      <p className="text-xs text-center text-gray-400">
        {isMoral ? '정답은 없어요. 당신의 가치관이 곧 답입니다 ⚖️' : '당신이라면 하나를 선택해야 한다면? 둘 다 싫어도 골라야 합니다 😈'}
      </p>

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
