'use client';

import { useState } from 'react';
import { createSeedContext } from '@/engine/hash';
import { getDailyQuizQuestions, generateQuizResult, QUIZ_META } from '@/engine/quiz';
import { getToday } from '@/lib/utils';
import ResultView from './ResultView';
import LeaderboardSection from '@/components/game/LeaderboardSection';

interface QuizRunnerProps {
  slug: string;
}

export default function QuizRunner({ slug }: QuizRunnerProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  // 슬러그를 시드에 포함해 퀴즈마다 다른 문제 세트가 선택되도록 함
  const seed = createSeedContext({ type: `quiz-${slug}` }, getToday());
  const questions = getDailyQuizQuestions(seed, slug);
  const meta = QUIZ_META[slug] ?? QUIZ_META['one-minute-quiz'];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
    if (idx === questions[currentQ].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentQ(prev => prev + 1);
      setAnswered(false);
      setSelectedIdx(null);
    }
  };

  if (finished) {
    const result = generateQuizResult(score, questions.length, seed, slug);
    const pctCorrect = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const resultEmoji = pctCorrect >= 80 ? '🎉' : pctCorrect >= 50 ? '👍' : '📚';
    return (
      <div className="space-y-4">
        {/* 결과 요약 카드 */}
        <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl p-8 text-center shadow-lg">
          <div className="flex justify-center gap-2 mb-3">
            <span className="text-5xl">{resultEmoji}</span>
            <span className="text-5xl">{meta.emoji}</span>
          </div>
          <p className="text-white/80 text-sm mb-1">{meta.title}</p>
          <p className="text-3xl font-black text-white">{score}개 정답</p>
          <p className="text-white/70 text-sm mt-1">{questions.length}문제 중 {score}개 · 정답률 {pctCorrect}%</p>
        </div>
        {/* 닉네임 등록 — 결과 바로 아래 */}
        <LeaderboardSection slug={slug} score={score} scoreLabel="정답" sortOrder="desc" />
        <ResultView result={result} slug={slug} />
      </div>
    );
  }

  const q = questions[currentQ];
  const pct = Math.round(((currentQ + (answered ? 1 : 0)) / questions.length) * 100);

  return (
    <div className="space-y-5">
      {/* 진행 바 */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {currentQ + 1}/{questions.length}
        </span>
      </div>

      {/* 퀴즈 카테고리 배지 */}
      <div className="flex items-center gap-2">
        <span className="text-base">{meta.emoji}</span>
        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
          {meta.title}
        </span>
      </div>

      {/* 문제 카드 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p className="text-base font-bold text-gray-900 mb-5 leading-snug">{q.question}</p>

        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            let btnClass =
              'w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ';

            if (!answered) {
              btnClass +=
                'border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50 active:scale-[0.98]';
            } else if (i === q.correctIndex) {
              btnClass += 'border-green-400 bg-green-50 text-green-700';
            } else if (i === selectedIdx) {
              btnClass += 'border-red-400 bg-red-50 text-red-600';
            } else {
              btnClass += 'border-gray-100 text-gray-400';
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={btnClass}
                disabled={answered}
              >
                <span className="font-bold text-gray-400 mr-2">
                  {['①', '②', '③', '④'][i]}
                </span>
                {opt}
                {answered && i === q.correctIndex && (
                  <span className="ml-2 text-green-500">✓</span>
                )}
                {answered && i === selectedIdx && i !== q.correctIndex && (
                  <span className="ml-2 text-red-400">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <button
            onClick={handleNext}
            className="w-full mt-5 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors"
          >
            {currentQ + 1 >= questions.length ? '결과 보기 →' : '다음 문제 →'}
          </button>
        )}
      </div>

      {/* 하단 점수 + 진행률 */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>현재 점수: <strong className="text-gray-600">{score}</strong> / {currentQ + (answered ? 1 : 0)}</span>
        <span>정답률 {pct}%</span>
      </div>
    </div>
  );
}
