'use client';

import { useState, useEffect } from 'react';

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  created_at: string;
}

interface GameLeaderboardProps {
  gameSlug: string;           // API에 전달할 게임 식별자
  scoreLabel: string;         // 점수 단위 표시 (e.g. "ms", "단계", "자리")
  sortOrder: 'asc' | 'desc'; // asc: 낮을수록 좋음, desc: 높을수록 좋음
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

export default function GameLeaderboard({
  gameSlug,
  scoreLabel,
  sortOrder,
  currentNickname,
  currentScore,
  onRestart,
}: GameLeaderboardProps) {
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // sortOrder는 표시 목적으로만 사용 (API에서 이미 정렬됨)
  void sortOrder;

  useEffect(() => {
    const saveAndFetch = async () => {
      setLoading(true);
      setErrorMsg(null);

      const nicknameToSave = currentNickname.trim() || '익명';

      // 1) 점수 저장
      try {
        await fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            game_slug: gameSlug,
            nickname: nicknameToSave,
            score: currentScore,
          }),
        });
      } catch {
        // 저장 실패해도 조회는 계속 시도
      }

      // 2) 전체 Top 20 조회
      try {
        const res = await fetch(`/api/leaderboard?game=${gameSlug}`);
        if (!res.ok) throw new Error('fetch failed');
        const json = await res.json() as { data: LeaderboardEntry[] };
        const entries = json.data ?? [];
        setBoard(entries);

        // 내 순위 찾기
        const rank =
          entries.findIndex(
            (e) => e.nickname === nicknameToSave && e.score === currentScore,
          ) + 1;
        setMyRank(rank > 0 ? rank : null);
      } catch {
        setErrorMsg('랭킹을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    saveAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 마운트 시 한 번만 실행

  const nicknameToSave = currentNickname.trim() || '익명';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-bold text-gray-900">🏆 전체 랭킹</h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          상위 20명
        </span>
      </div>

      {myRank && !loading && (
        <div className="mb-3 px-3 py-2 bg-blue-50 rounded-xl flex items-center gap-2">
          <span className="text-sm font-bold text-blue-700">{getRankEmoji(myRank)}</span>
          <span className="text-sm text-blue-600">
            내 순위 — <strong>{currentScore}{scoreLabel}</strong>
          </span>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-400 text-sm space-y-2">
          <p className="text-2xl animate-pulse">⏳</p>
          <p>랭킹 불러오는 중...</p>
        </div>
      )}

      {!loading && errorMsg && (
        <div className="text-center py-4 text-red-400 text-sm">{errorMsg}</div>
      )}

      {!loading && !errorMsg && board.length === 0 && (
        <div className="text-center py-4 text-gray-400 text-sm">
          아직 등록된 기록이 없습니다. 첫 번째 기록이 되세요!
        </div>
      )}

      {!loading && !errorMsg && board.length > 0 && (
        <div className="space-y-1.5">
          {board.map((entry, i) => {
            const isMe =
              myRank === i + 1 &&
              entry.score === currentScore &&
              entry.nickname === nicknameToSave;

            return (
              <div
                key={`${entry.nickname}-${entry.score}-${i}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${
                  isMe
                    ? 'bg-blue-50 border border-blue-200'
                    : i < 3
                    ? 'bg-amber-50'
                    : 'bg-gray-50'
                }`}
              >
                <span className="w-8 text-center font-bold text-xs shrink-0">
                  {getRankEmoji(i + 1)}
                </span>
                <span
                  className={`flex-1 font-medium truncate ${
                    isMe ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {entry.nickname}
                  {isMe && (
                    <span className="text-blue-400 text-xs ml-1">← 나</span>
                  )}
                </span>
                <span
                  className={`font-bold text-sm shrink-0 ${
                    i === 0
                      ? 'text-yellow-600'
                      : i === 1
                      ? 'text-gray-500'
                      : i === 2
                      ? 'text-amber-700'
                      : isMe
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  {entry.score}{scoreLabel}
                </span>
                <span className="text-xs text-gray-400 shrink-0">
                  {entry.created_at?.slice(5, 10)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-3 text-center">
        * 전 세계 사용자와 함께하는 실시간 랭킹입니다
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
