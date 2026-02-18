'use client';

import { useState } from 'react';
import ResultView from './ResultView';
import { GenerateResultOutput } from '@/engine/types';

interface ScoreQuestion { id: string; text: string; }
interface ScoreResult {
  minScore: number; maxScore: number;
  emoji: string; title: string; summary: string;
  traits: string[]; doToday: string; avoidToday: string;
}
interface ScoreTestData {
  yesLabel: string; noLabel: string;
  headerBg: string; headerText: string; headerEmoji: string;
  questions: ScoreQuestion[];
  results: ScoreResult[];
}

// ─── 각 테스트 데이터 ──────────────────────────────────────────────────
const TESTS: Record<string, ScoreTestData> = {
  'red-flag-test': {
    yesLabel: '🚩 해당돼요', noLabel: '😇 아니에요',
    headerBg: 'from-red-500 to-pink-600', headerText: '연애 레드플래그 체크', headerEmoji: '🚩',
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
    ],
    results: [
      { minScore: 0,  maxScore: 2,  emoji: '🕊️', title: '청정구역 인증',
        summary: '당신은 인류의 희망입니다. 레드플래그 0개.',
        traits: ['청정', '안정적', '인류의 희망'],
        doToday: '지금처럼만 살아주세요. 세상이 조금 더 살기 좋아집니다.',
        avoidToday: '주변의 레드플래그에 물들지 마세요' },
      { minScore: 3,  maxScore: 5,  emoji: '🟡', title: '약간의 붉은 기운',
        summary: '조금 있긴 한데... 아직 구제 가능합니다.',
        traits: ['자각 있음', '구제 가능', '성장 중'],
        doToday: '자각이 있다는 게 이미 반 이상 온 겁니다. 계속 의식해봐요.',
        avoidToday: '이 점수에 안주하지 마세요. 더 나아질 수 있어요' },
      { minScore: 6,  maxScore: 8,  emoji: '🟠', title: '위험 인물 접근 주의',
        summary: '당신 옆에 있는 사람들, 꽤 수고가 많습니다.',
        traits: ['강한 감정', '표현 과잉', '구제 중'],
        doToday: '오늘은 상대방 입장에서 한 번 생각해보는 연습을 해보세요.',
        avoidToday: '새벽에 감정적인 메시지 보내는 것, 오늘만큼은 참아봐요' },
      { minScore: 9,  maxScore: 10, emoji: '🔴', title: '레드플래그 화신',
        summary: '전 연인들이 친목 모임을 열고 있을 수도 있습니다.',
        traits: ['집착형', '감정 폭발', '전설적'],
        doToday: '지금 당장 "나를 위한 시간"을 만들어보세요. 진지하게.',
        avoidToday: '오늘은 연락하고 싶어도 꾹 참아보는 연습을 해요' },
      { minScore: 11, maxScore: 12, emoji: '🚩🚩🚩', title: '당신 자체가 레드플래그',
        summary: '레드플래그를 수집하는 수집가. 당신이 레드플래그입니다.',
        traits: ['레전드급', '자각 필요', '전설적 존재'],
        doToday: '지금 당장 전문가 상담을 받아보는 것을 진지하게 고려해보세요.',
        avoidToday: '연애 전에 스스로를 먼저 점검해보는 시간이 필요합니다' },
    ],
  },

  'brain-rot-level': {
    yesLabel: '✅ 완전 나잖아?', noLabel: '🙅 아니에요',
    headerBg: 'from-green-500 to-teal-600', headerText: '뇌 썩음 레벨 측정기', headerEmoji: '🧠',
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
    ],
    results: [
      { minScore: 0,  maxScore: 2,  emoji: '🧠', title: '뇌 건강 양호',
        summary: '당신의 뇌는 아직 건강합니다. 비결을 나눠주세요.',
        traits: ['자기절제', '집중력', '건강한 뇌'],
        doToday: '지금 이 상태를 유지해주세요. 당신이 부럽습니다.',
        avoidToday: '쇼츠 앱을 켜는 것. 들어가면 나오기 어렵습니다' },
      { minScore: 3,  maxScore: 5,  emoji: '🤔', title: '뇌 반쯤 익음',
        summary: '중간 정도. 현대인의 평균입니다. 그나마 괜찮아요.',
        traits: ['평균적', '현대인', '회복 가능'],
        doToday: '오늘 30분만 폰 없이 지내보세요. 할 수 있어요. 아마도.',
        avoidToday: '잠들기 30분 전 폰 보는 것. 뇌가 더 썩습니다' },
      { minScore: 6,  maxScore: 7,  emoji: '🍳', title: '뇌 거의 다 익음',
        summary: '이대로 가면 알고리즘이 당신의 하루를 설계합니다.',
        traits: ['뇌 반숙', '집중력 저하', '알고리즘 포로'],
        doToday: '오늘 읽던 책 한 페이지라도 펼쳐보세요.',
        avoidToday: '"5분만 더"라는 말. 그게 2시간이 됩니다' },
      { minScore: 8,  maxScore: 9,  emoji: '💀', title: '뇌 썩음 상태',
        summary: '뇌 썩음 확정. 알고리즘이 당신을 먹고 있습니다.',
        traits: ['뇌썩 진행중', '알고리즘 의존', '회복 필요'],
        doToday: '폰 없이 10분 산책을 해보세요. 그게 지금 당신에게 최선입니다.',
        avoidToday: '새벽에 쇼츠 보는 것. 새벽 4시가 됩니다' },
      { minScore: 10, maxScore: 10, emoji: '🤯', title: '완전한 뇌썩 경지',
        summary: '축하합니다(?) 현대 인터넷 문화의 완전한 산물입니다.',
        traits: ['뇌썩 만렙', '현대인 끝판왕', '인터넷 화신'],
        doToday: '지금 당장 폰을 내려놓으세요. 이 테스트 결과를 읽고 나서요.',
        avoidToday: '이 결과를 공유하려고 SNS 켜는 것. (또 썩어요)' },
    ],
  },

  'npc-test': {
    yesLabel: '😔 맞아요', noLabel: '✨ 아니에요',
    headerBg: 'from-blue-500 to-indigo-600', headerText: '나는 NPC인가 주인공인가?', headerEmoji: '🎮',
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
    ],
    results: [
      { minScore: 0,  maxScore: 2,  emoji: '🌟', title: '확실한 주인공형',
        summary: '스스로의 인생을 살고 있습니다. 진짜 멋집니다.',
        traits: ['주체적', '능동적', '주인공'],
        doToday: '오늘도 당신이 원하는 것을 하나 실천해보세요.',
        avoidToday: '주변의 "아무거나"에 휩쓸리지 마세요' },
      { minScore: 3,  maxScore: 5,  emoji: '🎭', title: '주인공과 NPC 사이',
        summary: '가끔 주인공, 가끔 NPC. 그게 현실입니다.',
        traits: ['현실적', '균형', '성장 중'],
        doToday: '오늘 한 가지라도 완전히 내 선택으로 결정해보세요.',
        avoidToday: '"어디든 좋아요"라는 말. 당신의 의견이 중요합니다' },
      { minScore: 6,  maxScore: 7,  emoji: '🤖', title: 'NPC 판정 임박',
        summary: '지금 당장 뭐든 결정해야 합니다. 점심 메뉴라도.',
        traits: ['수동적', '무기력', '깨어나야 함'],
        doToday: '오늘 딱 하나만 먼저 결정하고 행동해보세요.',
        avoidToday: '중요한 선택을 미루는 것. 계속 미루면 선택지가 없어집니다' },
      { minScore: 8,  maxScore: 9,  emoji: '💤', title: 'NPC 확정',
        summary: '당신의 인생 시나리오를 다른 누군가가 쓰고 있습니다.',
        traits: ['완전 수동형', 'NPC 확정', '각성 필요'],
        doToday: '지금 이 순간부터 딱 하나, 스스로 원하는 것을 선택해보세요.',
        avoidToday: '"나중에"라는 말. 그 나중은 오지 않을 수 있습니다' },
      { minScore: 10, maxScore: 10, emoji: '😴', title: '슈퍼 NPC (전설)',
        summary: '당신은 세상에서 가장 평화로운 NPC입니다.',
        traits: ['완전 수동', '전설적 NPC', '주인공 되기 도전'],
        doToday: '지금 폰을 내려놓고 창밖을 5초만 봐보세요. 시작은 그것부터.',
        avoidToday: '이 결과를 보고 "역시 나는 NPC네"하고 수긍하는 것' },
    ],
  },
};

interface Props { slug: string; }

export default function ScoreTestRunner({ slug }: Props) {
  const data = TESTS[slug];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<boolean | null>(null);

  if (!data) return null;

  const questions = data.questions;
  const q = questions[current];

  const handleAnswer = (isYes: boolean) => {
    if (selected !== null) return;
    setSelected(isYes);
    if (isYes) setScore(prev => prev + 1);

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setFinished(true);
      } else {
        setCurrent(prev => prev + 1);
        setSelected(null);
      }
    }, 500);
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
    return <ResultView result={output} slug={slug} />;
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
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className={`bg-gradient-to-r ${data.headerBg} px-5 py-3 flex items-center gap-2`}>
          <span className="text-white text-base">{data.headerEmoji}</span>
          <span className="text-white font-bold text-sm">{data.headerText}</span>
        </div>

        <div className="p-5">
          <p className="text-base font-bold text-gray-900 leading-snug mb-6">
            Q{current + 1}. {q.text}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAnswer(true)}
              disabled={selected !== null}
              className={`py-4 px-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
                selected === true
                  ? 'border-red-400 bg-red-50 text-red-600'
                  : selected === false
                  ? 'border-gray-100 text-gray-300'
                  : 'border-red-200 text-red-500 hover:bg-red-50'
              }`}
            >
              {data.yesLabel}
            </button>
            <button
              onClick={() => handleAnswer(false)}
              disabled={selected !== null}
              className={`py-4 px-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
                selected === false
                  ? 'border-blue-400 bg-blue-50 text-blue-600'
                  : selected === true
                  ? 'border-gray-100 text-gray-300'
                  : 'border-blue-200 text-blue-500 hover:bg-blue-50'
              }`}
            >
              {data.noLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>해당 항목: <strong className="text-gray-600">{score}</strong>개</span>
        <span>진행률 {pct}%</span>
      </div>
    </div>
  );
}
