'use client';

import { useState } from 'react';
import { QuestionPack, ContentInput } from '@/engine/types';
import { generateTestResult } from '@/engine/test';
import ResultView from './ResultView';

interface TestRunnerProps {
  questionPack: QuestionPack;
  slug: string;
}

export default function TestRunner({ questionPack, slug }: TestRunnerProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleConfirm = () => {
    if (!selected) return;
    const q = questionPack.questions[currentQ];
    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ + 1 >= questionPack.questions.length) {
      setFinished(true);
    } else {
      setCurrentQ(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQ === 0) return;
    const prevQ = questionPack.questions[currentQ - 1];
    setSelected(answers[prevQ.id] ?? null);
    setCurrentQ(prev => prev - 1);
  };

  if (finished) {
    const input: ContentInput = {};
    const result = generateTestResult(input, answers, questionPack);
    return (
      <div className="space-y-4">
<ResultView result={result} slug={slug} />
      </div>
    );
  }

  const q = questionPack.questions[currentQ];
  return (
    <div className="space-y-6">
      {/* 진행 바 */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentQ + 1) / questionPack.questions.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {currentQ + 1}/{questionPack.questions.length}
        </span>
      </div>

      {/* 문제 */}
      <div key={currentQ} className="bg-white rounded-2xl border border-gray-100 p-6">
        <p className="text-lg font-bold text-gray-900 mb-4">{q.text}</p>
        <div className="space-y-2">
          {q.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm active:scale-[0.98] ${
                selected === opt.value
                  ? 'border-purple-500 bg-purple-50 text-purple-900 font-medium'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* 다음/이전 버튼 */}
        <div className="flex items-center gap-2 mt-4">
          {currentQ > 0 && (
            <button
              onClick={handleBack}
              className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all text-sm"
            >
              ← 이전
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={!selected}
            className={`flex-1 py-3 rounded-xl font-medium transition-all text-sm ${
              selected
                ? 'bg-purple-500 text-white hover:bg-purple-600 active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentQ + 1 >= questionPack.questions.length ? '결과 보기' : '다음'}
          </button>
        </div>
      </div>

    </div>
  );
}
