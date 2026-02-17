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
  const [finished, setFinished] = useState(false);

  const handleAnswer = (value: string) => {
    const q = questionPack.questions[currentQ];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

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
  const showMidAd = currentQ === 5; // 중간에 광고 1개 (5번째 문제 후)

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
              onClick={() => handleAnswer(opt.value)}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 active:scale-[0.98] transition-all text-sm text-gray-700"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {showMidAd && <AdSlot slot="A" />}
    </div>
  );
}
