'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { generateColorMemoryResult } from '@/engine/game';
import ResultView from './ResultView';
import GameLeaderboard from '@/components/game/GameLeaderboard';

const GAME_SLUG = 'color-memory';

const COLORS = [
  { id: 'red',    label: '🔴', bg: 'bg-red-500',    dim: 'bg-red-200',    text: 'text-white' },
  { id: 'green',  label: '🟢', bg: 'bg-green-500',  dim: 'bg-green-200',  text: 'text-white' },
  { id: 'blue',   label: '🔵', bg: 'bg-blue-500',   dim: 'bg-blue-200',   text: 'text-white' },
  { id: 'yellow', label: '🟡', bg: 'bg-yellow-400', dim: 'bg-yellow-100', text: 'text-gray-800' },
];

type GamePhase = 'ready' | 'showing' | 'input' | 'correct' | 'wrong' | 'done' | 'nickname' | 'leaderboard';

export default function ColorMemoryGame() {
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [nickname, setNickname] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const playSequence = useCallback((seq: number[]) => {
    setPhase('showing');
    setActiveColor(null);
    let i = 0;

    const showNext = () => {
      if (i >= seq.length) {
        setActiveColor(null);
        timerRef.current = setTimeout(() => setPhase('input'), 400);
        return;
      }
      setActiveColor(seq[i]);
      timerRef.current = setTimeout(() => {
        setActiveColor(null);
        timerRef.current = setTimeout(() => {
          i++;
          showNext();
        }, 250);
      }, 600);
    };

    timerRef.current = setTimeout(showNext, 500);
  }, []);

  const startGame = () => {
    const first = Math.floor(Math.random() * 4);
    const newSeq = [first];
    setSequence(newSeq);
    setPlayerInput([]);
    playSequence(newSeq);
  };

  const handleColorTap = (colorIdx: number) => {
    if (phase !== 'input') return;

    const newInput = [...playerInput, colorIdx];
    setPlayerInput(newInput);

    const pos = newInput.length - 1;

    if (newInput[pos] !== sequence[pos]) {
      // 틀림
      setActiveColor(colorIdx);
      timerRef.current = setTimeout(() => {
        setActiveColor(null);
        setPhase('wrong');
      }, 300);
      return;
    }

    setActiveColor(colorIdx);
    timerRef.current = setTimeout(() => setActiveColor(null), 200);

    if (newInput.length === sequence.length) {
      // 이 라운드 성공
      setPhase('correct');
      timerRef.current = setTimeout(() => {
        const newSeq = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(newSeq);
        setPlayerInput([]);
        playSequence(newSeq);
      }, 700);
    }
  };

  const maxLevel = phase === 'wrong' || phase === 'done' || phase === 'nickname' || phase === 'leaderboard'
    ? sequence.length - 1
    : sequence.length;

  const handleSubmitNickname = () => {
    setPhase('leaderboard');
  };

  // 게임 오버 화면
  if (phase === 'wrong') {
    const result = generateColorMemoryResult(maxLevel);
    return (
      <div className="space-y-4">
        <div className="bg-red-50 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">😵</p>
          <p className="font-bold text-red-700">{maxLevel}단계에서 실패!</p>
          <p className="text-sm text-gray-500 mt-1">달성 최고 단계: {maxLevel}단계</p>
        </div>
        <ResultView result={result} slug="color-memory" />

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
              className="min-w-0 flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-base focus:outline-none focus:border-primary box-border"
            />
            <button
              onClick={handleSubmitNickname}
              className="flex-shrink-0 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors"
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
    const result = generateColorMemoryResult(maxLevel);
    return (
      <div className="space-y-4">
        <ResultView result={result} slug="color-memory" />
        <GameLeaderboard
          gameSlug={GAME_SLUG}
          scoreLabel="단계"
          sortOrder="desc"
          currentNickname={nickname}
          currentScore={maxLevel}
          onRestart={startGame}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 진행 단계 표시 */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, sequence.length * 8)}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {sequence.length > 0 ? `${sequence.length}단계` : '대기'}
        </span>
      </div>

      {/* 상태 메시지 */}
      <div className="text-center py-3">
        {phase === 'ready' && <p className="text-gray-500 text-sm">색깔 순서를 기억하고 그대로 탭하세요!</p>}
        {phase === 'showing' && <p className="text-blue-600 font-bold animate-pulse">순서를 기억하세요... 👀</p>}
        {phase === 'input' && <p className="text-green-600 font-bold">이제 탭하세요! ({playerInput.length}/{sequence.length})</p>}
        {phase === 'correct' && <p className="text-purple-600 font-bold">✅ 정답! 다음 단계로...</p>}
      </div>

      {/* 4색 버튼 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {COLORS.map((color, idx) => (
          <button
            key={color.id}
            onClick={() => handleColorTap(idx)}
            disabled={phase !== 'input'}
            className={`
              h-32 rounded-2xl text-4xl font-bold transition-all duration-100 select-none
              ${activeColor === idx ? color.bg + ' scale-95 shadow-lg' : color.dim}
              ${phase === 'input' ? 'cursor-pointer active:scale-95' : 'cursor-default'}
            `}
          >
            {color.label}
          </button>
        ))}
      </div>

      {/* 시작 버튼 */}
      {phase === 'ready' && (
        <button
          onClick={startGame}
          className="w-full py-4 bg-purple-500 text-white rounded-xl font-bold text-lg hover:bg-purple-600 transition-colors"
        >
          시작하기
        </button>
      )}
    </div>
  );
}
