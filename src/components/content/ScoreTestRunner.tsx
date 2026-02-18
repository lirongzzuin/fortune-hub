'use client';

import { useState, useMemo } from 'react';
import ResultView from './ResultView';
import { GenerateResultOutput } from '@/engine/types';
import LeaderboardSection from '@/components/game/LeaderboardSection';

interface ScoreQuestion { id: string; text: string; }
interface ScoreResult {
  minScore: number; maxScore: number;
  emoji: string; title: string; summary: string;
  traits: string[]; doToday: string; avoidToday: string;
  visual: { emojis: string[]; gradient: string };
}
interface ScoreTestData {
  yesLabel: string; noLabel: string;
  headerBg: string; headerText: string; headerEmoji: string;
  pickCount: number;
  questions: ScoreQuestion[];
  results: ScoreResult[];
}

// ─── 각 테스트 데이터 ──────────────────────────────────────────────────
const TESTS: Record<string, ScoreTestData> = {
  'red-flag-test': {
    yesLabel: '해당돼요', noLabel: '아니에요',
    headerBg: 'from-red-500 to-pink-600', headerText: '연애 레드플래그 체크', headerEmoji: '🚩',
    pickCount: 12,
    questions: [
      { id: 'rf1',  text: '새벽 2시에 "나 지금 울어" 또는 "지금 나올 수 있어?" 메시지를 보낸 적이 있다' },
      { id: 'rf2',  text: '상대방 SNS의 마지막 접속 시간이나 게시글 좋아요를 주기적으로 확인한다' },
      { id: 'rf3',  text: '"그냥 아무거나"라고 했다가 상대가 추천하면 다 싫다고 한 적이 있다' },
      { id: 'rf4',  text: '전 연인의 SNS를 (그 사람도 모르게) 지금도 가끔 본다' },
      { id: 'rf5',  text: '"나 원래 이런 사람 아닌데"라는 말을 3회 이상 한 적 있다' },
      { id: 'rf6',  text: '"됐어, 신경 쓰지 마"라고 했지만 실제로는 신경 써주길 기다렸다' },
      { id: 'rf7',  text: '상대방이 5분 이상 답장을 안 하면 다른 SNS로 생존 확인을 한 적 있다' },
      { id: 'rf8',  text: '연인에게 "나 없으면 어떻게 살았을 것 같아?"를 반복해서 물어봤다' },
      { id: 'rf9',  text: '의미심장한 새벽 인스타 스토리를 올린 적 있다 (가사, 꺼진 불, 빗속 사진 등)' },
      { id: 'rf10', text: '관계가 끝난 후 특정 노래나 장소를 봉인한 적이 있다' },
      { id: 'rf11', text: '"나는 집착 안 해"라고 말하면서 실제로는 집착하고 있었다' },
      { id: 'rf12', text: '이 테스트를 하면서 "이게 왜 레드플래그야?"라고 생각한 항목이 있다' },
      { id: 'rf13', text: '상대방을 좋아하는지 친구한테 물어보면서 카톡 분석을 요청한 적이 있다' },
      { id: 'rf14', text: '연인의 카톡 프로필 사진이 바뀌면 바로 캡처해서 이전 것과 비교했다' },
      { id: 'rf15', text: '"왜 먼저 연락 안 해?"라고 하면서 먼저 연락은 절대 안 하는 원칙이 있다' },
      { id: 'rf16', text: '답장 속도로 상대방의 기분과 나에 대한 감정 변화를 분석한 적이 있다' },
      { id: 'rf17', text: '상대방이 나를 좋아하는 게 확실한 상황에서도 "확인"을 계속 요구했다' },
      { id: 'rf18', text: '연인과 싸운 후 상대가 먼저 연락 오길 기다리며 일부러 폰을 안 봤다' },
      { id: 'rf19', text: '연인의 통화 상대나 카톡 내용이 궁금해서 확인하고 싶었던 적이 있다' },
      { id: 'rf20', text: '상대방 행동을 "이건 나를 좋아하지 않는 신호"라고 과도하게 해석한 적이 있다' },
      { id: 'rf21', text: '"바쁘다"는 말이 거짓말처럼 느껴져서 증거를 찾으려 했다' },
      { id: 'rf22', text: '연인의 친구 목록이나 팔로워 중 이성을 찾아본 적이 있다' },
      { id: 'rf23', text: '이별 후 상대방이 나보다 잘 지내는 것 같아 보이면 기분이 나빴다' },
      { id: 'rf24', text: '화가 났을 때 "됐어"라고 하고 방을 나갔지만 따라오기를 기대했다' },
      { id: 'rf25', text: '잘 맞는 척하기 위해 좋아하지도 않는 것들을 좋아한다고 말한 적 있다' },
      { id: 'rf26', text: '상대가 다른 사람과 맛있는 것을 먹었다는 사실에 불쾌함을 느꼈다' },
      { id: 'rf27', text: '연인이 나한테만 집중해줬으면 했던 순간들이 자주 있었다' },
      { id: 'rf28', text: '상대방의 "바빠"라는 말을 진짜로 받아들이기 어려웠다' },
      { id: 'rf29', text: '이별 직후 "이제 나 없이 잘 해봐"라는 말이 먼저 나왔다' },
      { id: 'rf30', text: '연인이 나를 위해 뭔가를 해줄 때 내가 먼저 한 것의 크기와 비교했다' },
      { id: 'rf31', text: '상대방이 오늘따라 답장이 느린 이유를 여러 가지 상상해봤다' },
      { id: 'rf32', text: '"내가 잘 해줄 수 있는데"라는 마음으로 부적절한 관계를 이어간 적이 있다' },
      { id: 'rf33', text: '연애 중 "이 사람이 진짜인가?" 확인하려고 테스트를 해본 적이 있다' },
      { id: 'rf34', text: '상대방이 나 외의 이성과 단 둘이 있는 게 불편하다' },
      { id: 'rf35', text: '이별 통보를 받은 후 "한 번만 더 기회를 달라"고 여러 번 말한 적이 있다' },
      { id: 'rf36', text: '나를 거절한 사람에게 "왜 싫어?"라고 이유를 집요하게 물어봤다' },
      { id: 'rf37', text: '상대방의 SNS에서 나 모르는 이성이 자꾸 등장하면 기분이 나빠진다' },
      { id: 'rf38', text: '연인에게 화났을 때 일부러 다른 이성과 친하게 지내는 척한 적이 있다' },
      { id: 'rf39', text: '"좋아하면 이 정도는 당연한 거 아니야?"라고 생각한 것들이 있다' },
      { id: 'rf40', text: '연애를 시작한 지 얼마 안 돼서 미래 계획(결혼 등)을 구체적으로 이야기했다' },
      { id: 'rf41', text: '상대방이 좋아하는 취미나 음식을 억지로 좋아하는 척한 적이 있다' },
      { id: 'rf42', text: '"나만 이렇게 힘든 거야?"라는 말을 연인에게 자주 했다' },
      { id: 'rf43', text: '상대방이 실망스러울 때 SNS 상태메시지나 스토리로 간접적으로 표현했다' },
      { id: 'rf44', text: '전 연인이 새로운 사람을 만났다는 소식에 불필요하게 타격을 받았다' },
      { id: 'rf45', text: '연인이 나보다 친구와 시간을 더 많이 보낼 때 서운함이 강하게 느껴졌다' },
      { id: 'rf46', text: '"왜 내 기분을 몰라줘?"라고 말하면서 정작 내 기분을 설명하지 않았다' },
      { id: 'rf47', text: '상대방에게 말은 안 했지만 실망스러운 행동을 꼼꼼히 기억해뒀다' },
      { id: 'rf48', text: '상대방이 먼저 사과할 때까지 내가 잘못한 것도 인정하지 않았다' },
      { id: 'rf49', text: '"이 테스트 해봐"라고 연인한테 권유하려고 지금 이걸 하고 있다' },
      { id: 'rf50', text: '이 질문들이 너무 공감돼서 살짝 무서워졌다' },
    ],
    results: [
      { minScore: 0,  maxScore: 2,  emoji: '🕊️', title: '청정구역 인증',
        summary: '당신은 인류의 희망입니다. 레드플래그 0개.',
        traits: ['청정', '안정적', '인류의 희망'],
        doToday: '지금처럼만 살아주세요. 세상이 조금 더 살기 좋아집니다.',
        avoidToday: '주변의 레드플래그에 물들지 마세요',
        visual: { emojis: ['🕊️', '✨', '💚'], gradient: 'from-green-400 to-emerald-500' } },
      { minScore: 3,  maxScore: 5,  emoji: '🟡', title: '약간의 붉은 기운',
        summary: '조금 있긴 한데... 아직 구제 가능합니다.',
        traits: ['자각 있음', '구제 가능', '성장 중'],
        doToday: '자각이 있다는 게 이미 반 이상 온 겁니다. 계속 의식해봐요.',
        avoidToday: '이 점수에 안주하지 마세요. 더 나아질 수 있어요',
        visual: { emojis: ['🌤️', '🟡', '💛'], gradient: 'from-yellow-400 to-orange-400' } },
      { minScore: 6,  maxScore: 8,  emoji: '🟠', title: '위험 인물 접근 주의',
        summary: '당신 옆에 있는 사람들, 꽤 수고가 많습니다.',
        traits: ['강한 감정', '표현 과잉', '구제 중'],
        doToday: '오늘은 상대방 입장에서 한 번 생각해보는 연습을 해보세요.',
        avoidToday: '새벽에 감정적인 메시지 보내는 것, 오늘만큼은 참아봐요',
        visual: { emojis: ['⚠️', '🟠', '🔥'], gradient: 'from-orange-400 to-red-500' } },
      { minScore: 9,  maxScore: 10, emoji: '🔴', title: '레드플래그 화신',
        summary: '전 연인들이 친목 모임을 열고 있을 수도 있습니다.',
        traits: ['집착형', '감정 폭발', '전설적'],
        doToday: '지금 당장 "나를 위한 시간"을 만들어보세요. 진지하게.',
        avoidToday: '오늘은 연락하고 싶어도 꾹 참아보는 연습을 해요',
        visual: { emojis: ['🚩', '🔴', '💔'], gradient: 'from-red-500 to-pink-600' } },
      { minScore: 11, maxScore: 12, emoji: '🚩🚩🚩', title: '당신 자체가 레드플래그',
        summary: '레드플래그를 수집하는 수집가. 당신이 레드플래그입니다.',
        traits: ['레전드급', '자각 필요', '전설적 존재'],
        doToday: '지금 당장 전문가 상담을 받아보는 것을 진지하게 고려해보세요.',
        avoidToday: '연애 전에 스스로를 먼저 점검해보는 시간이 필요합니다',
        visual: { emojis: ['🚩', '🚩', '🚩'], gradient: 'from-rose-600 to-red-700' } },
    ],
  },

  'brain-rot-level': {
    yesLabel: '맞아요', noLabel: '아니에요',
    headerBg: 'from-green-500 to-teal-600', headerText: '뇌 썩음 레벨 측정기', headerEmoji: '🧟',
    pickCount: 10,
    questions: [
      { id: 'br1',  text: '유튜브 쇼츠나 릴스를 오늘도 1시간 이상 봤다' },
      { id: 'br2',  text: '밥 먹으면서 폰을 안 보면 뭔가 허전하고 불안하다' },
      { id: 'br3',  text: '영화나 드라마를 1.5배속 이하로 보면 답답하다' },
      { id: 'br4',  text: '5분 이상 집중이 필요한 일을 시작하는 데 30분이 걸린다' },
      { id: 'br5',  text: '누군가의 말을 들으면서 속으로 딴생각을 하고 있다' },
      { id: 'br6',  text: '대화 중에 "그래서 결론이 뭐야?"가 먼저 나온다' },
      { id: 'br7',  text: '영화 보다가 폰 보고, 폰 보다가 다시 영화를 켠 적 있다' },
      { id: 'br8',  text: '알 수 없는 이유로 오늘도 새벽 2시를 넘겼다' },
      { id: 'br9',  text: '"이거 왜 재밌지?"라고 생각하면서도 계속 보고 있다' },
      { id: 'br10', text: '지금 이 테스트도 할 일을 제쳐두고 하고 있다' },
      { id: 'br11', text: '5분이 넘는 영상이 나오면 재생하기 전에 먼저 타임라인을 넘겨봤다' },
      { id: 'br12', text: '"잠깐만"하고 폰 봤다가 30분이 지나 있었다' },
      { id: 'br13', text: '대화 중에 상대방 말이 끝나기 전에 내 답이 이미 정해져 있다' },
      { id: 'br14', text: '읽은 기사 내용보다 댓글 창을 더 오래 봤다' },
      { id: 'br15', text: '오늘 한 일을 물어보면 딱히 뭔가를 했다는 기억이 없다' },
      { id: 'br16', text: '"오늘 뭐 해?"에 "유튜브 봐"라고 자연스럽게 대답했다' },
      { id: 'br17', text: '어제 본 쇼츠 내용은 기억 안 나는데 보는 건 멈출 수 없다' },
      { id: 'br18', text: '두 개 이상의 앱을 번갈아 가며 동시에 보고 있다' },
      { id: 'br19', text: '긴 글이 나오면 자동으로 중간 정도만 읽고 스크롤을 내린다' },
      { id: 'br20', text: '주변이 조용하면 불안해서 뭔가 틀어놓게 된다' },
      { id: 'br21', text: '화장실 갈 때 폰을 가지고 들어가는 게 기본값이다' },
      { id: 'br22', text: '"잠깐 쉬었다 해야지"가 항상 한 시간 이상이다' },
      { id: 'br23', text: '밥을 먹으면서 뭔가를 보지 않으면 밥이 제대로 넘어가지 않는 것 같다' },
      { id: 'br24', text: '"알림 없애야지"라고 생각하면서 알림을 켜두고 있다' },
      { id: 'br25', text: '유튜브 알고리즘이 추천하는 것과 내 취향이 완전히 일치한다' },
      { id: 'br26', text: '오늘 읽은 텍스트 중 책은 한 글자도 없었다' },
      { id: 'br27', text: '충전 중인 폰이 멀어서 못 보고 있으면 계속 신경 쓰인다' },
      { id: 'br28', text: '"쉬려고" 켰다가 피로해져서 끈 적이 더 많다' },
      { id: 'br29', text: '폰 없이 버스를 타거나 기다리는 것이 불가능할 것 같다' },
      { id: 'br30', text: '10분 이상 폰 없이 있으면 시간이 멈춘 것 같다' },
      { id: 'br31', text: '멀티태스킹을 한다고 생각하지만 실제로는 아무것도 못 하고 있다' },
      { id: 'br32', text: '유튜브나 넷플릭스를 끄려고 했다가 "이거 하나만 더" 한 게 5번 이상이다' },
      { id: 'br33', text: '오늘 틱톡이나 릴스에서 웃긴 게 나왔는데 내용은 기억이 안 난다' },
      { id: 'br34', text: '음악을 틀어두고 이어폰까지 꽂지만 노래가 뭔지 모를 때가 있다' },
      { id: 'br35', text: '책을 사거나 다운받았지만 처음 몇 페이지 이상 읽은 게 없다' },
      { id: 'br36', text: '뉴스를 보다가 맥락은 모르고 제목만 읽고 아는 척한 적이 있다' },
      { id: 'br37', text: '폰 화면이 어두워지면 자동으로 화면을 켠다' },
      { id: 'br38', text: '잠들기 전 "10분만 보다 자자"가 새벽 2시로 이어진 적이 있다' },
      { id: 'br39', text: '식당에서 음식을 기다리는 5분 동안 폰을 안 보기가 힘들다' },
      { id: 'br40', text: '일을 하면서 딴짓한 시간이 일한 시간보다 길었던 날이 이번 주에 있었다' },
      { id: 'br41', text: '뭔가 재미있는 걸 보면 반사적으로 공유하려고 한다' },
      { id: 'br42', text: '오늘 정말 아무것도 안 했는데 왜 피곤한지 모를 때가 있다' },
      { id: 'br43', text: '짧은 영상만 보다가 10분짜리 영상이 너무 긴 것 같다' },
      { id: 'br44', text: '"집중해야지"하고 핸드폰을 뒤집어 놓았다가 다시 집어들었다' },
      { id: 'br45', text: '새로운 앱이나 콘텐츠를 발견하면 일단 시작해보는 편이다' },
      { id: 'br46', text: '화면이 없는 곳에서 멍하니 기다리는 게 어색하게 느껴진다' },
      { id: 'br47', text: '친구한테 "요즘 뭐 봐?"로 대화를 시작한 적이 있다' },
      { id: 'br48', text: '"집중 모드" 앱을 깔았지만 그 앱을 켜는 것조차 귀찮아서 못 켰다' },
      { id: 'br49', text: '좋아하는 유튜버의 영상 길이가 길어서 실망한 적이 있다' },
      { id: 'br50', text: '이 테스트의 문항이 많았으면 중간에 나갔을 것 같다' },
    ],
    results: [
      { minScore: 0,  maxScore: 2,  emoji: '🧠', title: '뇌 건강 양호',
        summary: '당신의 뇌는 아직 건강합니다. 비결을 나눠주세요.',
        traits: ['자기절제', '집중력', '건강한 뇌'],
        doToday: '지금 이 상태를 유지해주세요. 당신이 부럽습니다.',
        avoidToday: '쇼츠 앱을 켜는 것. 들어가면 나오기 어렵습니다',
        visual: { emojis: ['🧠', '✨', '💪'], gradient: 'from-blue-400 to-cyan-500' } },
      { minScore: 3,  maxScore: 5,  emoji: '🤔', title: '뇌 반쯤 익음',
        summary: '중간 정도. 현대인의 평균입니다. 그나마 괜찮아요.',
        traits: ['평균적', '현대인', '회복 가능'],
        doToday: '오늘 30분만 폰 없이 지내보세요. 할 수 있어요. 아마도.',
        avoidToday: '잠들기 30분 전 폰 보는 것. 뇌가 더 썩습니다',
        visual: { emojis: ['🤔', '📱', '😅'], gradient: 'from-yellow-400 to-green-400' } },
      { minScore: 6,  maxScore: 7,  emoji: '🍳', title: '뇌 거의 다 익음',
        summary: '이대로 가면 알고리즘이 당신의 하루를 설계합니다.',
        traits: ['뇌 반숙', '집중력 저하', '알고리즘 포로'],
        doToday: '오늘 읽던 책 한 페이지라도 펼쳐보세요.',
        avoidToday: '"5분만 더"라는 말. 그게 2시간이 됩니다',
        visual: { emojis: ['🍳', '🔥', '📱'], gradient: 'from-orange-400 to-amber-500' } },
      { minScore: 8,  maxScore: 9,  emoji: '💀', title: '뇌 썩음 상태',
        summary: '뇌 썩음 확정. 알고리즘이 당신을 먹고 있습니다.',
        traits: ['뇌썩 진행중', '알고리즘 의존', '회복 필요'],
        doToday: '폰 없이 10분 산책을 해보세요. 그게 지금 당신에게 최선입니다.',
        avoidToday: '새벽에 쇼츠 보는 것. 새벽 4시가 됩니다',
        visual: { emojis: ['💀', '🧟', '📱'], gradient: 'from-green-600 to-teal-700' } },
      { minScore: 10, maxScore: 10, emoji: '🤯', title: '완전한 뇌썩 경지',
        summary: '축하합니다(?) 현대 인터넷 문화의 완전한 산물입니다.',
        traits: ['뇌썩 만렙', '현대인 끝판왕', '인터넷 화신'],
        doToday: '지금 당장 폰을 내려놓으세요. 이 테스트 결과를 읽고 나서요.',
        avoidToday: '이 결과를 공유하려고 SNS 켜는 것. (또 썩어요)',
        visual: { emojis: ['🤯', '💀', '🧠'], gradient: 'from-red-500 to-rose-600' } },
    ],
  },

  'npc-test': {
    yesLabel: '맞아요', noLabel: '아니에요',
    headerBg: 'from-blue-500 to-indigo-600', headerText: '나는 NPC인가 주인공인가?', headerEmoji: '🎮',
    pickCount: 10,
    questions: [
      { id: 'npc1',  text: '오늘 아무것도 결정하지 않고 그냥 흘러갔다' },
      { id: 'npc2',  text: '먹고 싶은 음식을 물어보면 "아무거나"라고 대답한다' },
      { id: 'npc3',  text: '지금 하는 일이 내가 원해서 하는 건지 확실하지 않다' },
      { id: 'npc4',  text: '어제와 오늘의 차이를 딱히 못 느꼈다' },
      { id: 'npc5',  text: '10년 후 내 모습을 상상하면 지금과 크게 다르지 않을 것 같다' },
      { id: 'npc6',  text: '누군가의 계획이나 결정에 따라 내 일정이 정해진다' },
      { id: 'npc7',  text: '하고 싶은 말을 참은 게 이번 주에만 3번 이상이다' },
      { id: 'npc8',  text: '퇴근 후 집에서 아무것도 안 하고 폰만 봤다' },
      { id: 'npc9',  text: '"언젠가는 해야지"라고 생각하는 게 지금 3개 이상이다' },
      { id: 'npc10', text: '이 테스트도 사실 심심해서 그냥 하고 있다' },
      { id: 'npc11', text: '친구가 제안한 것에 "그래, 좋아"라고 하는 게 대부분이다' },
      { id: 'npc12', text: '오늘 먹은 점심을 내가 결정했는가? 잘 모르겠다' },
      { id: 'npc13', text: '최근에 내 의지로 시작한 새로운 취미나 도전이 없다' },
      { id: 'npc14', text: '불합리하다고 생각하면서도 그냥 참는 편이다' },
      { id: 'npc15', text: '스스로 목표를 세운 적이 마지막이 언제인지 기억이 잘 안 난다' },
      { id: 'npc16', text: '"남들이 다 하니까"라는 이유로 뭔가를 시작한 경험이 있다' },
      { id: 'npc17', text: '하고 싶었던 것을 포기한 적이 최근 6개월 안에 3번 이상 있다' },
      { id: 'npc18', text: '오늘의 기분이 주변 사람이나 상황에 의해 좌우됐다' },
      { id: 'npc19', text: '스스로 계획을 세웠다가 타인이 한 번 반대하면 바로 접는 편이다' },
      { id: 'npc20', text: '퇴근하면 "뭔가 해야지"라고 생각하다가 결국 아무것도 안 했다' },
      { id: 'npc21', text: '중요한 결정 앞에서 정답을 알고 싶어 주변에 물어보게 된다' },
      { id: 'npc22', text: '"나중에"라는 말이 실제 행동으로 이어진 적이 최근에 없었다' },
      { id: 'npc23', text: '하기 싫은 약속을 거절하지 못하고 그냥 나간 적이 이번 달에 있다' },
      { id: 'npc24', text: '내 감정이 지금 어떤지를 정확히 설명하기 어렵다' },
      { id: 'npc25', text: '오늘 스스로를 위해 한 일이 딱히 없었다' },
      { id: 'npc26', text: '누군가 나한테 먼저 연락해야 만남이 이루어지는 패턴이 있다' },
      { id: 'npc27', text: '좋아하는 것이 뭔지 물어보면 바로 대답이 안 나온다' },
      { id: 'npc28', text: '변화가 생기면 적응하는 쪽이지 변화를 만드는 쪽은 아니다' },
      { id: 'npc29', text: '오늘 새로운 자극(새 장소, 새 경험)이 아무것도 없었다' },
      { id: 'npc30', text: '내 의견이 묵살되어도 다시 강조하지 않는 편이다' },
      { id: 'npc31', text: '연락 온 거에 반응하는 게 먼저 연락하는 것보다 훨씬 많다' },
      { id: 'npc32', text: '지금 뭔가 바꾸고 싶다는 생각은 있지만 뭘 바꿔야 할지 모른다' },
      { id: 'npc33', text: '오늘 내가 먼저 주도적으로 한 대화가 없었다' },
      { id: 'npc34', text: '불편한 상황에서 먼저 말을 꺼내기보다 상황이 끝나길 기다렸다' },
      { id: 'npc35', text: '오늘 내가 진짜 원하는 게 무엇인지 모른 채 하루가 지났다' },
      { id: 'npc36', text: '뭔가를 선택하기 전에 다른 사람이 어떻게 선택할지를 먼저 생각한다' },
      { id: 'npc37', text: '내가 무언가를 이루기 위해 적극적으로 움직인 게 이번 주에 없었다' },
      { id: 'npc38', text: '오늘 처음 해본 것이 없다' },
      { id: 'npc39', text: '"난 원래 이런 사람이야"라고 생각하며 변화 시도 자체를 안 하는 편이다' },
      { id: 'npc40', text: '꿈이나 목표가 있지만 구체적인 계획은 없다' },
      { id: 'npc41', text: '어제도 오늘도 내일도 비슷한 루틴으로 살 것 같다' },
      { id: 'npc42', text: '하기 싫은 일을 거절하기 어려워서 그냥 했다' },
      { id: 'npc43', text: '오늘 가장 많이 한 일이 "기다리는 것"이었다' },
      { id: 'npc44', text: '스스로 어떤 사람이 되고 싶은지를 생각해본 지 오래됐다' },
      { id: 'npc45', text: '결정을 내리는 것보다 다른 사람이 결정해주는 게 더 편하다' },
      { id: 'npc46', text: '지금 내 인생에서 진심으로 좋아하는 게 뭔지 잘 모르겠다' },
      { id: 'npc47', text: '"나중에 하자"가 며칠이 지나도 안 된 경험이 이번 달에 있다' },
      { id: 'npc48', text: '내 삶의 방향에 대해 진지하게 생각해본 게 언제인지 기억이 잘 안 난다' },
      { id: 'npc49', text: '이 테스트 결과가 나와도 삶이 달라지지 않을 것 같다' },
      { id: 'npc50', text: '나는 내가 어떤 사람인지 잘 모른다' },
    ],
    results: [
      { minScore: 0,  maxScore: 2,  emoji: '🌟', title: '확실한 주인공형',
        summary: '스스로의 인생을 살고 있습니다. 진짜 멋집니다.',
        traits: ['주체적', '능동적', '주인공'],
        doToday: '오늘도 당신이 원하는 것을 하나 실천해보세요.',
        avoidToday: '주변의 "아무거나"에 휩쓸리지 마세요',
        visual: { emojis: ['🌟', '⚡', '🦁'], gradient: 'from-violet-500 to-purple-600' } },
      { minScore: 3,  maxScore: 5,  emoji: '🎭', title: '주인공과 NPC 사이',
        summary: '가끔 주인공, 가끔 NPC. 그게 현실입니다.',
        traits: ['현실적', '균형', '성장 중'],
        doToday: '오늘 한 가지라도 완전히 내 선택으로 결정해보세요.',
        avoidToday: '"어디든 좋아요"라는 말. 당신의 의견이 중요합니다',
        visual: { emojis: ['🎭', '🎯', '🌗'], gradient: 'from-blue-400 to-indigo-500' } },
      { minScore: 6,  maxScore: 7,  emoji: '🤖', title: 'NPC 판정 임박',
        summary: '지금 당장 뭐든 결정해야 합니다. 점심 메뉴라도.',
        traits: ['수동적', '무기력', '깨어나야 함'],
        doToday: '오늘 딱 하나만 먼저 결정하고 행동해보세요.',
        avoidToday: '중요한 선택을 미루는 것. 계속 미루면 선택지가 없어집니다',
        visual: { emojis: ['🤖', '💤', '⏳'], gradient: 'from-slate-400 to-gray-500' } },
      { minScore: 8,  maxScore: 9,  emoji: '💤', title: 'NPC 확정',
        summary: '당신의 인생 시나리오를 다른 누군가가 쓰고 있습니다.',
        traits: ['완전 수동형', 'NPC 확정', '각성 필요'],
        doToday: '지금 이 순간부터 딱 하나, 스스로 원하는 것을 선택해보세요.',
        avoidToday: '"나중에"라는 말. 그 나중은 오지 않을 수 있습니다',
        visual: { emojis: ['💤', '🤖', '😶'], gradient: 'from-gray-500 to-slate-600' } },
      { minScore: 10, maxScore: 10, emoji: '😴', title: '슈퍼 NPC (전설)',
        summary: '당신은 세상에서 가장 평화로운 NPC입니다.',
        traits: ['완전 수동', '전설적 NPC', '주인공 되기 도전'],
        doToday: '지금 폰을 내려놓고 창밖을 5초만 봐보세요. 시작은 그것부터.',
        avoidToday: '이 결과를 보고 "역시 나는 NPC네"하고 수긍하는 것',
        visual: { emojis: ['😴', '💤', '🕹️'], gradient: 'from-indigo-600 to-blue-700' } },
    ],
  },

  'gifted-burnout': {
    yesLabel: '맞아요', noLabel: '아니에요',
    headerBg: 'from-amber-500 to-yellow-600', headerText: '영재 번아웃 체크', headerEmoji: '🎓',
    pickCount: 12,
    questions: [
      { id: 'gb1',  text: '어릴 때 "공부 잘한다", "머리 좋다"는 말을 자주 들었다' },
      { id: 'gb2',  text: '노력을 안 해도 학교 성적이 잘 나왔던 적이 있었다' },
      { id: 'gb3',  text: '무언가를 잘 하지 못할 것 같으면 시작 자체를 피하게 된다' },
      { id: 'gb4',  text: '"나는 원래 이것쯤은 잘 해야 해"라는 생각이 자주 든다' },
      { id: 'gb5',  text: '칭찬받기 위해 혹은 실망시키지 않기 위해 행동한 적이 있다' },
      { id: 'gb6',  text: '완벽하게 할 수 없다면 차라리 안 하는 게 낫다는 생각이 든다' },
      { id: 'gb7',  text: '어른들이 나에게 거는 기대가 부담스러웠던 시절이 있었다' },
      { id: 'gb8',  text: '노력하는 것을 남들에게 보여주기 싫었던 적이 있다 (노력하는 모습이 창피했다)' },
      { id: 'gb9',  text: '"열심히 하지 않았는데 이 정도면 잘 한 거잖아"라고 합리화한 적 있다' },
      { id: 'gb10', text: '잘 해야 한다는 압박에 오히려 아무것도 못 한 적이 있다 (퍼포먼스 불안)' },
      { id: 'gb11', text: '성인이 된 지금, 특별히 잘 하는 게 없다는 느낌이 든다' },
      { id: 'gb12', text: '어릴 때 칭찬받던 내가 지금의 나보다 더 대단했던 것 같다' },
      { id: 'gb13', text: '새로운 것을 배울 때 처음부터 잘 못 하면 포기하고 싶다' },
      { id: 'gb14', text: '실패나 실수가 너무 두려워서 도전 자체를 꺼린다' },
      { id: 'gb15', text: '남들이 나를 어떻게 평가하는지가 지금도 매우 신경 쓰인다' },
      { id: 'gb16', text: '"나 사실 별로 대단하지 않은데 그동안 착각하게 했나봐"라는 생각이 든다' },
      { id: 'gb17', text: '칭찬받으면 기분이 좋지만 "이번엔 기대에 못 미치면 어떡하지"가 바로 따라온다' },
      { id: 'gb18', text: '잘 해왔기 때문에 "이 정도도 못 하면 안 된다"는 자기 기준이 높다' },
      { id: 'gb19', text: '스스로에게 매우 엄격하고 실수를 잘 용납하지 못한다' },
      { id: 'gb20', text: '남들은 쉽게 즐기는 것도 나는 잘 해야 한다는 생각에 즐기기 어렵다' },
      { id: 'gb21', text: '재능 있다는 말이 오히려 부담이나 불안으로 느껴진 적이 있다' },
      { id: 'gb22', text: '내가 특별하지 않으면 사랑받지 못할 것 같다는 느낌이 있었다' },
      { id: 'gb23', text: '어릴 때부터 "나는 특별해야 해"라는 생각이 어딘가에 자리 잡고 있었다' },
      { id: 'gb24', text: '번아웃이 와도 "내가 이 정도에 지쳐? 원래 더 잘 했는데"라고 자책한다' },
      { id: 'gb25', text: '오늘 이 테스트를 보면서 마음 한편이 뜨끔했다' },
    ],
    results: [
      { minScore: 0,  maxScore: 3,  emoji: '🌱', title: '영재 번아웃과 거리가 멀어요',
        summary: '기대와 압박에서 비교적 자유롭게 자라온 것 같아요.',
        traits: ['자유로운 성장', '건강한 자아', '압박 없음'],
        doToday: '지금의 건강한 자아상을 유지하세요.',
        avoidToday: '남과 비교하는 것. 당신만의 속도가 있어요',
        visual: { emojis: ['🌱', '🌞', '💚'], gradient: 'from-green-400 to-emerald-500' } },
      { minScore: 4,  maxScore: 7,  emoji: '🎯', title: '살짝 번아웃 흔적 있음',
        summary: '잘 해야 한다는 압박이 조금 있지만 잘 버티고 있어요.',
        traits: ['성취 지향', '약간의 압박', '균형 중'],
        doToday: '오늘은 잘 못 해도 괜찮다는 허락을 스스로에게 줘보세요.',
        avoidToday: '완벽주의가 도전을 막지 않도록 주의하세요',
        visual: { emojis: ['🎯', '💡', '🌤️'], gradient: 'from-yellow-400 to-amber-500' } },
      { minScore: 8,  maxScore: 12, emoji: '🔥', title: '영재 번아웃 중간 단계',
        summary: '어릴 때의 기대와 지금의 나 사이에서 힘들어하고 있어요.',
        traits: ['완벽주의', '자기비판', '회복 필요'],
        doToday: '노력하는 과정 자체를 인정해주세요. 결과만이 전부가 아닙니다.',
        avoidToday: '"나는 원래 이것쯤은 해야지"라는 생각',
        visual: { emojis: ['🔥', '😮‍💨', '📚'], gradient: 'from-orange-400 to-red-500' } },
      { minScore: 13, maxScore: 19, emoji: '💔', title: '영재 번아웃 심화 단계',
        summary: '"특별해야 한다"는 압박이 오래된 상처가 됐을 수 있어요.',
        traits: ['높은 기대 압박', '자기 의심', '상처 치유 필요'],
        doToday: '당신이 특별하지 않아도 충분히 소중한 존재임을 기억하세요.',
        avoidToday: '자신을 어릴 때의 모습과 계속 비교하는 것',
        visual: { emojis: ['💔', '🫂', '🌧️'], gradient: 'from-purple-400 to-indigo-500' } },
      { minScore: 20, maxScore: 25, emoji: '🫂', title: '깊은 영재 번아웃',
        summary: '오랫동안 혼자 많은 기대를 감당해왔군요. 정말 수고했어요.',
        traits: ['만성 번아웃', '깊은 자기 의심', '치유가 필요'],
        doToday: '전문가의 도움을 받는 것을 두려워하지 마세요. 당신은 도움받을 자격이 있어요.',
        avoidToday: '"내가 이러면 안 되는데"라고 스스로를 더 몰아붙이는 것',
        visual: { emojis: ['🫂', '💙', '🌈'], gradient: 'from-blue-500 to-purple-600' } },
    ],
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

interface Props { slug: string; }

export default function ScoreTestRunner({ slug }: Props) {
  const data = TESTS[slug];

  // 질문 랜덤 선택 (마운트 시 한 번만)
  const questions = useMemo(() => {
    if (!data) return [];
    const seed = Date.now() ^ (Math.random() * 0xffffffff);
    return shuffleWithSeed(data.questions, seed).slice(0, data.pickCount);
  }, [data]);

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [history, setHistory] = useState<boolean[]>([]);

  if (!data) return null;

  const q = questions[current];
  const handleAnswer = (isYes: boolean) => {
    if (selected !== null) return;
    setSelected(isYes);
    if (isYes) setScore(prev => prev + 1);

    setTimeout(() => {
      setHistory(prev => [...prev, isYes]);
      if (current + 1 >= questions.length) {
        setFinished(true);
      } else {
        setCurrent(prev => prev + 1);
        setSelected(null);
      }
    }, 500);
  };

  const handleBack = () => {
    if (current === 0 || history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    if (last) setScore(prev => prev - 1);
    setCurrent(prev => prev - 1);
    setSelected(null);
  };

  if (finished) {
    const finalScore = score;
    const r = data.results.find(
      res => finalScore >= res.minScore && finalScore <= res.maxScore
    ) ?? data.results[data.results.length - 1];

    const output: GenerateResultOutput = {
      resultKey: `score-${slug}-${finalScore}`,
      summary: `${r.emoji} ${r.title}`,
      keywords: r.traits,
      doToday: r.doToday,
      avoidToday: r.avoidToday,
      detailSections: [
        { area: 'type',   label: r.title,      emoji: r.emoji, text: r.summary },
        { area: 'score',  label: '나의 점수',   emoji: '📊', text: `총 ${questions.length}개 중 ${finalScore}개 해당` },
        { area: 'traits', label: '나의 특성',   emoji: '🔍', text: r.traits.join(' · ') },
        { area: 'tip',    label: '오늘의 팁',   emoji: '💡', text: r.doToday },
      ],
      personalDetail: `${questions.length}문항 중 ${finalScore}개가 해당된 당신의 점수입니다.`,
      shareCard: {
        title: `${data.headerText} 결과: ${r.title}`,
        summary: r.summary,
        keywords: r.traits,
      },
      meta: { disclaimer: false, generatedAt: new Date().toISOString().slice(0, 10) },
    };

    return (
      <div className="space-y-4">
        {/* 랭킹 등록 */}
        <LeaderboardSection slug={slug} score={finalScore} scoreLabel="점" sortOrder="desc" />
        {/* 비주얼 결과 카드 */}
        <div className={`bg-gradient-to-br ${r.visual.gradient} rounded-2xl p-8 text-center shadow-lg`}>
          <div className="flex justify-center gap-3 mb-4">
            {r.visual.emojis.map((em, i) => (
              <span key={i} className="text-5xl">{em}</span>
            ))}
          </div>
          <h2 className="text-2xl font-black text-white mb-1">{r.title}</h2>
          <p className="text-white/80 text-sm">{r.summary}</p>
        </div>
        <ResultView result={output} slug={slug} />
      </div>
    );
  }

  const pct = Math.round((current / questions.length) * 100);

  return (
    <div className="space-y-5">
      {/* 진행 바 */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${data.headerBg} rounded-full transition-all duration-300`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">{current + 1}/{questions.length}</span>
      </div>

      {/* 질문 카드 */}
      <div key={current} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className={`bg-gradient-to-r ${data.headerBg} px-5 py-3 flex items-center gap-2`}>
          <span className="text-white text-base">{data.headerEmoji}</span>
          <span className="text-white font-bold text-sm">{data.headerText}</span>
        </div>

        <div className="p-5">
          <p className="text-base font-bold text-gray-900 leading-snug mb-6">
            Q{current + 1}. {q.text}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* YES 버튼 */}
            <button
              onClick={() => handleAnswer(true)}
              disabled={selected !== null}
              className={`py-5 px-3 rounded-2xl border-2 transition-all active:scale-95 flex flex-col items-center gap-1 ${
                selected === true
                  ? 'border-emerald-400 bg-emerald-50'
                  : selected === false
                  ? 'border-gray-100 opacity-30'
                  : 'border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <span className="text-4xl leading-none">⭕</span>
              <span className={`text-base font-black mt-1 ${selected === true ? 'text-emerald-600' : 'text-emerald-500'}`}>YES</span>
              <span className={`text-xs ${selected === true ? 'text-emerald-500' : 'text-gray-400'}`}>{data.yesLabel}</span>
            </button>
            {/* NO 버튼 */}
            <button
              onClick={() => handleAnswer(false)}
              disabled={selected !== null}
              className={`py-5 px-3 rounded-2xl border-2 transition-all active:scale-95 flex flex-col items-center gap-1 ${
                selected === false
                  ? 'border-red-400 bg-red-50'
                  : selected === true
                  ? 'border-gray-100 opacity-30'
                  : 'border-red-200 hover:bg-red-50'
              }`}
            >
              <span className="text-4xl leading-none">❌</span>
              <span className={`text-base font-black mt-1 ${selected === false ? 'text-red-600' : 'text-red-500'}`}>NO</span>
              <span className={`text-xs ${selected === false ? 'text-red-500' : 'text-gray-400'}`}>{data.noLabel}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        {current > 0 && selected === null ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors"
          >
            ← 이전 문제
          </button>
        ) : (
          <span>해당 항목: <strong className="text-gray-600">{score}</strong>개</span>
        )}
        <span>진행률 {pct}%</span>
      </div>
    </div>
  );
}
