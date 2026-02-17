'use client';

import { useState } from 'react';
import { createSeedContext } from '@/engine/hash';
import { getDailyQuizQuestions, generateQuizResult } from '@/engine/quiz';
import { getToday } from '@/lib/utils';
import ResultView from './ResultView';

export default function QuizRunner() {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const seed = createSeedContext({ type: 'quiz' }, getToday());
  const questions = getDailyQuizQuestions(seed);

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
    const result = generateQuizResult(score, questions.length, seed);
    return <ResultView result={result} slug="one-minute-quiz" />;
  }

  const q = questions[currentQ];

  return (
    <div className="space-y-6">
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

      {/* 문제 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-lg font-bold text-gray-900 mb-4">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, i) => {
            let btnClass = 'w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ';
            if (!answered) {
              btnClass += 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98]';
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
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <button
            onClick={handleNext}
            className="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            {currentQ + 1 >= questions.length ? '결과 보기' : '다음 문제'}
          </button>
        )}
      </div>

      {/* 점수 */}
      <div className="text-center text-sm text-gray-400">
        현재 점수: {score}/{currentQ + (answered ? 1 : 0)}
      </div>
    </div>
  );
}
