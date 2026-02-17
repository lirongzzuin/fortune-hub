'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { generateGameResult } from '@/engine/game';
import ResultView from './ResultView';

type GameState = 'ready' | 'waiting' | 'go' | 'too-early' | 'done' | 'finished' | 'nickname' | 'leaderboard';

const TOTAL_ROUNDS = 5;
const LEADERBOARD_KEY = 'reaction-tap-leaderboard';
const MAX_ENTRIES = 20;

interface LeaderboardEntry {
  nickname: string;
  avgMs: number;
  date: string; // YYYY-MM-DD
}

function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

function saveToLeaderboard(entry: LeaderboardEntry): LeaderboardEntry[] {
  try {
    const existing = loadLeaderboard();
    const updated = [...existing, entry]
      .sort((a, b) => a.avgMs - b.avgMs)
      .slice(0, MAX_ENTRIES);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

function getRankLabel(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}위`;
}

export default function ReactionTapGame() {
  const [state, setState] = useState<GameState>('ready');
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [nickname, setNickname] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myAvg, setMyAvg] = useState<number>(0);
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

    const delay = 1000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      goTimeRef.current = Date.now();
      setState('go');
    }, delay);
  };

  const handleTap = () => {
    if (state === 'waiting') {
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

  const handleSubmitNickname = () => {
    const name = nickname.trim() || '익명';
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    setMyAvg(avg);

    const entry: LeaderboardEntry = {
      nickname: name.slice(0, 10), // 최대 10자
      avgMs: avg,
      date: new Date().toISOString().slice(0, 10),
    };

    const updated = saveToLeaderboard(entry);
    setLeaderboard(updated);

    const rank = updated.findIndex(e => e.nickname === entry.nickname && e.avgMs === entry.avgMs) + 1;
    setMyRank(rank > 0 ? rank : null);
    setState('leaderboard');
  };

  const handleRestart = () => {
    setRound(0);
    setTimes([]);
    setCurrentTime(null);
    setNickname('');
    setMyRank(null);
    setState('ready');
  };

  // 게임 종료 → 닉네임 입력
  if (state === 'finished') {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const best = Math.min(...times);
    const result = generateGameResult(avg, times.length, best);

    return (
      <div className="space-y-4">
        <ResultView result={result} slug="reaction-tap" />

        {/* 닉네임 입력 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-1">🏆 랭킹에 등록하기</h3>
          <p className="text-xs text-gray-500 mb-3">닉네임을 입력하면 이 기기 랭킹에 기록됩니다 (상위 {MAX_ENTRIES}명)</p>
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
            onClick={handleRestart}
            className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            건너뛰고 다시 도전하기
          </button>
        </div>
      </div>
    );
  }

  // 리더보드 표시
  if (state === 'leaderboard') {
    const avg = myAvg;
    const best = Math.min(...times);
    const result = generateGameResult(avg, times.length, best);

    return (
      <div className="space-y-4">
        <ResultView result={result} slug="reaction-tap" />

        {/* 리더보드 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-3">🏆 이 기기 랭킹 (상위 {MAX_ENTRIES}명)</h3>
          {myRank && (
            <p className="text-sm text-blue-600 font-medium mb-3">
              내 순위: {getRankLabel(myRank)} — 평균 {avg}ms
            </p>
          )}
          <div className="space-y-2">
            {leaderboard.map((entry, i) => {
              const isMe = myRank === i + 1 &&
                entry.avgMs === avg &&
                entry.nickname === (nickname.trim() || '익명');
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${
                    isMe ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <span className="w-8 text-center font-bold text-gray-500">
                    {getRankLabel(i + 1)}
                  </span>
                  <span className={`flex-1 font-medium ${isMe ? 'text-blue-700' : 'text-gray-700'}`}>
                    {entry.nickname} {isMe ? '← 나' : ''}
                  </span>
                  <span className={`font-bold ${isMe ? 'text-blue-600' : 'text-gray-500'}`}>
                    {entry.avgMs}ms
                  </span>
                  <span className="text-xs text-gray-400">{entry.date}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">* 이 기기에서 기록된 랭킹입니다</p>
        </div>

        <button
          onClick={handleRestart}
          className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
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
              onClick={startRound}
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
              onClick={startRound}
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
