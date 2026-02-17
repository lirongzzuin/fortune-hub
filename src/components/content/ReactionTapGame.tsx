'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { generateGameResult } from '@/engine/game';
import ResultView from './ResultView';

type GameState = 'ready' | 'waiting' | 'go' | 'too-early' | 'done' | 'finished';

const TOTAL_ROUNDS = 5;

export default function ReactionTapGame() {
  const [state, setState] = useState<GameState>('ready');
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const goTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startRound = () => {
    cleanup();
    setState('waiting');
    setCurrentTime(null);

    // 랜덤 대기 시간 (1~4초)
    const delay = 1000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      goTimeRef.current = Date.now();
      setState('go');
    }, delay);
  };

  const handleTap = () => {
    if (state === 'waiting') {
      // 너무 일찍 탭
      cleanup();
      setState('too-early');
    } else if (state === 'go') {
      const reactionTime = Date.now() - goTimeRef.current;
      setCurrentTime(reactionTime);
      const newTimes = [...times, reactionTime];
      setTimes(newTimes);
      setRound(prev => prev + 1);

      if (newTimes.length >= TOTAL_ROUNDS) {
        setState('finished');
      } else {
        setState('done');
      }
    }
  };

  const handleNext = () => {
    startRound();
  };

  const handleRetry = () => {
    startRound();
  };

  const handleRestart = () => {
    setRound(0);
    setTimes([]);
    setCurrentTime(null);
    setState('ready');
  };

  // 로컬 스토리지에서 최고 기록 관리
  const saveBest = (avg: number) => {
    try {
      const key = 'reaction-tap-best';
      const prev = localStorage.getItem(key);
      if (!prev || avg < parseInt(prev)) {
        localStorage.setItem(key, String(avg));
      }
    } catch {
      // localStorage 접근 실패
    }
  };

  if (state === 'finished') {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const best = Math.min(...times);
    saveBest(avg);

    const result = generateGameResult(avg, times.length, best);
    return (
      <div>
        <ResultView result={result} slug="reaction-tap" />
        <button
          onClick={handleRestart}
          className="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 진행 상황 */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-300"
            style={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {round}/{TOTAL_ROUNDS}
        </span>
      </div>

      {/* 게임 영역 */}
      <div
        className={`rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center cursor-pointer select-none transition-colors ${
          state === 'ready'
            ? 'bg-blue-50 border-2 border-blue-200'
            : state === 'waiting'
            ? 'bg-red-500'
            : state === 'go'
            ? 'bg-green-500'
            : state === 'too-early'
            ? 'bg-yellow-400'
            : 'bg-gray-50 border border-gray-200'
        }`}
        onClick={
          state === 'waiting' || state === 'go'
            ? handleTap
            : undefined
        }
      >
        {state === 'ready' && (
          <div>
            <p className="text-5xl mb-4">👆</p>
            <p className="text-lg font-bold text-gray-900 mb-2">반응 속도 테스트</p>
            <p className="text-sm text-gray-500 mb-4">
              빨간색이 초록색으로 바뀌면 최대한 빠르게 탭하세요!
            </p>
            <button
              onClick={startRound}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              시작하기
            </button>
          </div>
        )}

        {state === 'waiting' && (
          <div>
            <p className="text-5xl mb-4">🔴</p>
            <p className="text-xl font-bold text-white">기다리세요...</p>
            <p className="text-sm text-white/70 mt-2">초록색이 되면 탭!</p>
          </div>
        )}

        {state === 'go' && (
          <div>
            <p className="text-5xl mb-4">🟢</p>
            <p className="text-xl font-bold text-white">지금 탭!</p>
          </div>
        )}

        {state === 'too-early' && (
          <div>
            <p className="text-5xl mb-4">⚠️</p>
            <p className="text-lg font-bold text-gray-900 mb-2">너무 빨랐어요!</p>
            <p className="text-sm text-gray-600 mb-4">초록색으로 바뀔 때까지 기다려주세요.</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {state === 'done' && (
          <div>
            <p className="text-5xl mb-4">⚡</p>
            <p className="text-3xl font-bold text-blue-600 mb-2">{currentTime}ms</p>
            <p className="text-sm text-gray-500 mb-4">
              {currentTime! < 250 ? '번개 같은 반응!' :
               currentTime! < 350 ? '꽤 빠르다!' :
               currentTime! < 450 ? '나쁘지 않다!' : '좀 더 집중해보자!'}
            </p>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              다음 라운드
            </button>
          </div>
        )}
      </div>

      {/* 이전 기록 */}
      {times.length > 0 && (
        <div className="flex gap-2 justify-center">
          {times.map((t, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500"
            >
              {t}ms
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
