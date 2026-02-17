'use client';

import { useState } from 'react';
import { QuestionPack, ContentInput } from '@/engine/types';
import { generateTestResult } from '@/engine/test';
import ResultView from './ResultView';
import AdSlot from '@/components/ad/AdSlot';

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

  if (finished) {
    const input: ContentInput = {};
    const result = generateTestResult(input, answers, questionPack);
    return <ResultView result={result} slug={slug} />;
  }

  const q = questionPack.questions[currentQ];
  const showMidAd = currentQ === 5;

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
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
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

        {/* 다음 버튼 */}
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className={`w-full mt-4 py-3 rounded-xl font-medium transition-all text-sm ${
            selected
              ? 'bg-purple-500 text-white hover:bg-purple-600 active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQ + 1 >= questionPack.questions.length ? '결과 보기' : '다음'}
        </button>
      </div>

      {showMidAd && <AdSlot slot="A" />}
    </div>
  );
}
