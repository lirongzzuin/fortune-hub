'use client';

import { useState, useEffect } from 'react';

export interface LeaderboardEntry {
  nickname: string;
  score: number;   // 게임마다 다른 단위 (ms, level, digits 등)
  date: string;    // YYYY-MM-DD
}

interface GameLeaderboardProps {
  storageKey: string;          // localStorage key
  maxEntries?: number;         // 최대 순위 수 (기본 20)
  scoreLabel: string;          // 점수 단위 표시 (e.g. "ms", "단계", "자리")
  sortOrder: 'asc' | 'desc';  // asc: 낮을수록 좋음(반응속도), desc: 높을수록 좋음(기억력)
  currentNickname: string;
  currentScore: number;
  onRestart: () => void;
}

function getRankEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}위`;
}

export function loadLeaderboard(key: string): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveToLeaderboard(
  key: string,
  entry: LeaderboardEntry,
  maxEntries: number,
  sortOrder: 'asc' | 'desc',
): LeaderboardEntry[] {
  try {
    const existing = loadLeaderboard(key);
    const updated = [...existing, entry]
      .sort((a, b) =>
        sortOrder === 'asc' ? a.score - b.score : b.score - a.score
      )
      .slice(0, maxEntries);
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export default function GameLeaderboard({
  storageKey,
  maxEntries = 20,
  scoreLabel,
  sortOrder,
  currentNickname,
  currentScore,
  onRestart,
}: GameLeaderboardProps) {
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);

  useEffect(() => {
    const entry: LeaderboardEntry = {
      nickname: currentNickname.trim() || '익명',
      score: currentScore,
      date: new Date().toISOString().slice(0, 10),
    };
    const updated = saveToLeaderboard(storageKey, entry, maxEntries, sortOrder);
    setBoard(updated);
    const rank =
      updated.findIndex(
        (e) => e.nickname === entry.nickname && e.score === entry.score
      ) + 1;
    setMyRank(rank > 0 ? rank : null);
  }, [storageKey, currentNickname, currentScore, maxEntries, sortOrder]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 mb-3">
        🏆 이 기기 랭킹 (상위 {maxEntries}명)
      </h3>
      {myRank && (
        <p className="text-sm text-blue-600 font-medium mb-3">
          내 순위: {getRankEmoji(myRank)} — {currentScore}{scoreLabel}
        </p>
      )}
      <div className="space-y-2">
        {board.map((entry, i) => {
          const isMe =
            myRank === i + 1 &&
            entry.score === currentScore &&
            entry.nickname === (currentNickname.trim() || '익명');
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${
                isMe ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
              }`}
            >
              <span className="w-8 text-center font-bold text-gray-500 text-xs">
                {getRankEmoji(i + 1)}
              </span>
              <span
                className={`flex-1 font-medium ${
                  isMe ? 'text-blue-700' : 'text-gray-700'
                }`}
              >
                {entry.nickname}
                {isMe && <span className="text-blue-400 text-xs ml-1">← 나</span>}
              </span>
              <span
                className={`font-bold text-sm ${
                  isMe ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {entry.score}{scoreLabel}
              </span>
              <span className="text-xs text-gray-400">{entry.date.slice(5)}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        * 이 기기에서 기록된 랭킹입니다
      </p>
      <button
        onClick={onRestart}
        className="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
      >
        다시 도전하기
      </button>
    </div>
  );
}
