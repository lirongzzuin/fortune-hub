'use client';

import { useState } from 'react';

interface Entry {
  nickname: string;
  score: number;
  created_at: string;
}

interface Props {
  slug: string;
  score: number;
  /** 점수 단위. 빈 문자열이면 '참여자 명단' 모드 (점수 숨김) */
  scoreLabel: string;
  sortOrder: 'asc' | 'desc';
}

function getRankEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}위`;
}

export default function LeaderboardSection({ slug, score, scoreLabel, sortOrder }: Props) {
  const [phase, setPhase] = useState<'input' | 'loading' | 'done' | 'skipped'>('input');
  const [nickname, setNickname] = useState('');
  const [submittedNick, setSubmittedNick] = useState('');
  const [board, setBoard] = useState<Entry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isCompletion = scoreLabel === '';

  // sortOrder는 표시 목적으로만 사용 (API에서 이미 정렬됨)
  void sortOrder;

  const handleSubmit = async () => {
    const nick = nickname.trim() || '익명';
    setSubmittedNick(nick);
    setPhase('loading');

    // 점수 저장
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_slug: slug, nickname: nick, score }),
      });
    } catch {
      // 저장 실패해도 조회 계속
    }

    // Top 20 조회
    try {
      const res = await fetch(`/api/leaderboard?game=${slug}`);
      const json = await res.json() as { data: Entry[] };
      const entries = json.data ?? [];
      setBoard(entries);
      const rank = entries.findIndex(
        (e) => e.nickname === nick && e.score === score
      ) + 1;
      setMyRank(rank > 0 ? rank : null);
    } catch {
      setError('랭킹을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
    }

    setPhase('done');
  };

  if (phase === 'input') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-1">🏆 전체 랭킹에 등록하기</h3>
        <p className="text-xs text-gray-500 mb-3">
          닉네임을 입력하면 전 세계 랭킹에 기록됩니다!
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="닉네임 (최대 10자)"
            maxLength={10}
            className="min-w-0 flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-base focus:outline-none focus:border-purple-400 box-border"
          />
          <button
            onClick={handleSubmit}
            className="flex-shrink-0 px-4 py-2.5 bg-purple-500 text-white rounded-xl text-sm font-medium hover:bg-purple-600 transition-colors"
          >
            등록
          </button>
        </div>
        <button
          onClick={() => setPhase('skipped')}
          className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          건너뛰기
        </button>
      </div>
    );
  }

  if (phase === 'skipped') return null;

  if (phase === 'loading') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center py-8 space-y-2">
        <p className="text-2xl animate-pulse">⏳</p>
        <p className="text-sm text-gray-400">랭킹 등록 중...</p>
      </div>
    );
  }

  // done
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-bold text-gray-900">
          {isCompletion ? '✨ 최근 참여자' : '🏆 전체 랭킹'}
        </h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          상위 20명
        </span>
      </div>

      {myRank && !isCompletion && (
        <div className="mb-3 px-3 py-2 bg-purple-50 rounded-xl flex items-center gap-2">
          <span className="text-sm font-bold text-purple-700">{getRankEmoji(myRank)}</span>
          <span className="text-sm text-purple-600">
            내 순위 — <strong>{score}{scoreLabel}</strong>
          </span>
        </div>
      )}

      {myRank && isCompletion && (
        <div className="mb-3 px-3 py-2 bg-purple-50 rounded-xl flex items-center gap-2">
          <span className="text-sm font-bold text-purple-700">{getRankEmoji(myRank)}</span>
          <span className="text-sm text-purple-600">
            <strong>{submittedNick}</strong> 님이 등록되었습니다!
          </span>
        </div>
      )}

      {error ? (
        <div className="text-center py-4 text-red-400 text-sm">{error}</div>
      ) : board.length === 0 ? (
        <div className="text-center py-4 text-gray-400 text-sm">
          첫 번째 기록이 되셨네요! 🎉
        </div>
      ) : (
        <div className="space-y-1.5">
          {board.map((entry, i) => {
            const isMe =
              myRank === i + 1 &&
              entry.nickname === submittedNick &&
              entry.score === score;

            return (
              <div
                key={`${entry.nickname}-${entry.score}-${i}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${
                  isMe
                    ? 'bg-purple-50 border border-purple-200'
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
                    isMe ? 'text-purple-700' : 'text-gray-700'
                  }`}
                >
                  {entry.nickname}
                  {isMe && (
                    <span className="text-purple-400 text-xs ml-1">← 나</span>
                  )}
                </span>
                {!isCompletion && (
                  <span
                    className={`font-bold text-sm shrink-0 ${
                      i === 0
                        ? 'text-yellow-600'
                        : i === 1
                        ? 'text-gray-500'
                        : i === 2
                        ? 'text-amber-700'
                        : isMe
                        ? 'text-purple-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {entry.score}{scoreLabel}
                  </span>
                )}
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
    </div>
  );
}
