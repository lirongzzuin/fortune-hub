'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { generateNumberMemoryResult } from '@/engine/game';
import ResultView from './ResultView';
import GameLeaderboard from '@/components/game/GameLeaderboard';

const GAME_SLUG = 'number-memory';
const SHOW_DURATION_BASE = 2000; // 기본 표시 시간 (ms)
const SHOW_DURATION_PER_DIGIT = 500; // 자릿수당 추가 시간

type GamePhase = 'ready' | 'showing' | 'input' | 'correct' | 'wrong' | 'nickname' | 'leaderboard';

function generateNumber(digits: number): string {
  // 첫 자리는 1-9, 나머지는 0-9
  let num = String(Math.floor(Math.random() * 9) + 1);
  for (let i = 1; i < digits; i++) {
    num += String(Math.floor(Math.random() * 10));
  }
  return num;
}

export default function NumberMemoryGame() {
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [digits, setDigits] = useState(3);
  const [currentNumber, setCurrentNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [nickname, setNickname] = useState('');
  const [maxDigits, setMaxDigits] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const showNumber = useCallback((d: number) => {
    const num = generateNumber(d);
    const duration = SHOW_DURATION_BASE + d * SHOW_DURATION_PER_DIGIT;
    setCurrentNumber(num);
    setUserInput('');
    setPhase('showing');
    setTimeLeft(Math.ceil(duration / 1000));

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    timerRef.current = setTimeout(() => {
      cleanup();
      setPhase('input');
    }, duration);
  }, [cleanup]);

  const startGame = () => {
    setDigits(3);
    setMaxDigits(0);
    showNumber(3);
  };

  const handleSubmit = () => {
    if (userInput === currentNumber) {
      // 정답
      setPhase('correct');
      const next = digits + 1;
      setDigits(next);
      setMaxDigits(prev => Math.max(prev, digits));
      timerRef.current = setTimeout(() => showNumber(next), 1000);
    } else {
      // 오답
      setMaxDigits(prev => Math.max(prev, digits - 1));
      setPhase('wrong');
    }
  };

  const handleSubmitNickname = () => {
    setPhase('leaderboard');
  };

  // 오답 화면
  if (phase === 'wrong') {
    const result = generateNumberMemoryResult(maxDigits);
    return (
      <div className="space-y-4">
        <div className="bg-red-50 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">😵</p>
          <p className="font-bold text-red-700">
            정답: <span className="font-mono text-lg">{currentNumber}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            입력: <span className="font-mono">{userInput || '(미입력)'}</span>
          </p>
          <p className="text-sm font-bold text-gray-700 mt-2">최대 {maxDigits}자리 달성!</p>
        </div>

        <ResultView result={result} slug="number-memory" />

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-1">🏆 랭킹에 등록하기</h3>
          <p className="text-xs text-gray-500 mb-3">닉네임을 입력하면 이 기기 랭킹에 기록됩니다</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmitNickname()}
              placeholder="닉네임 (최대 10자)"
              maxLength={10}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={handleSubmitNickname}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              등록
            </button>
          </div>
          <button
            onClick={startGame}
            className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            건너뛰고 다시 도전
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'leaderboard') {
    const result = generateNumberMemoryResult(maxDigits);
    return (
      <div className="space-y-4">
        <ResultView result={result} slug="number-memory" />
        <GameLeaderboard
          gameSlug={GAME_SLUG}
          scoreLabel="자리"
          sortOrder="desc"
          currentNickname={nickname}
          currentScore={maxDigits}
          onRestart={startGame}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 진행 단계 */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, (digits / 15) * 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {digits > 0 && phase !== 'ready' ? `${digits}자리` : '대기'}
        </span>
      </div>

      {/* 게임 영역 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[280px] flex flex-col items-center justify-center gap-4">

        {phase === 'ready' && (
          <div className="text-center">
            <p className="text-4xl mb-4">🔢</p>
            <p className="text-lg font-bold text-gray-900 mb-2">숫자 기억 게임</p>
            <p className="text-sm text-gray-500 mb-1">숫자가 잠깐 보였다 사라집니다.</p>
            <p className="text-sm text-gray-500 mb-6">정확하게 입력하면 자릿수가 늘어납니다!</p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors"
            >
              시작하기
            </button>
          </div>
        )}

        {phase === 'showing' && (
          <div className="text-center w-full">
            <p className="text-xs text-gray-400 mb-3">기억하세요! ({timeLeft}초)</p>
            <div className="bg-teal-50 rounded-xl py-6 px-4">
              <p className="font-mono text-4xl font-bold text-teal-700 tracking-widest break-all">
                {currentNumber}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-3">{digits}자리 숫자</p>
          </div>
        )}

        {phase === 'input' && (
          <div className="text-center w-full">
            <p className="text-sm font-bold text-gray-700 mb-3">방금 본 숫자를 입력하세요</p>
            <input
              type="tel"
              inputMode="numeric"
              value={userInput}
              onChange={e => setUserInput(e.target.value.replace(/\D/g, '').slice(0, digits + 2))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder={`${digits}자리 숫자`}
              autoFocus
              className="w-full font-mono text-2xl text-center py-4 px-3 border-2 border-teal-300 rounded-xl focus:outline-none focus:border-teal-500 tracking-widest"
            />
            <button
              onClick={handleSubmit}
              disabled={!userInput}
              className={`w-full mt-3 py-3 rounded-xl font-bold transition-colors ${
                userInput
                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              확인
            </button>
          </div>
        )}

        {phase === 'correct' && (
          <div className="text-center">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-xl font-bold text-teal-600">정답!</p>
            <p className="text-sm text-gray-500 mt-2">다음 단계 준비 중...</p>
          </div>
        )}
      </div>

      {/* 현재 레벨 안내 */}
      {(phase === 'showing' || phase === 'input') && (
        <p className="text-xs text-center text-gray-400">
          자릿수가 늘어날수록 어려워집니다. 집중하세요!
        </p>
      )}
    </div>
  );
}
