'use client';

import { useState, useEffect } from 'react';

interface Entry {
  nickname: string;
  score: number;
  created_at: string;
}

// 슬러그별 점수 단위 — 경쟁형 콘텐츠만 포함
const SCORE_LABELS: Record<string, string> = {
  // 미니 게임
  'reaction-tap':             'ms',
  'color-memory':             '단계',
  'number-memory':            '자리',
  // 밸런스 게임
  'hell-balance':             'A선택',
  'moral-dilemma':            'A선택',
  // 퀴즈
  'one-minute-quiz':          '정답',
  'physics-quiz':             '정답',
  'chemistry-quiz':           '정답',
  'biology-quiz':             '정답',
  'world-capitals-quiz':      '정답',
  'world-history-quiz':       '정답',
  // 점수형 테스트
  'red-flag-test':            '점',
  'brain-rot-level':          '점',
  'npc-test':                 '점',
  'gifted-burnout':           '점',
  'rizz-test':                '점',
  'delulu-test':              '점',
  'main-character-syndrome':  '점',
  'touch-grass-test':         '점',
  'sigma-mindset':            '점',
};

function getRankEmoji(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}위`;
}

interface Props {
  slug: string;
}

export default function LeaderboardPreview({ slug }: Props) {
  const [board, setBoard] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const scoreLabel = SCORE_LABELS[slug] ?? '';
  const isCompletion = scoreLabel === '';

  useEffect(() => {
    fetch(`/api/leaderboard?game=${slug}`)
      .then((r) => r.json())
      .then((json) => setBoard((json as { data: Entry[] }).data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  // 기록이 없으면 아무것도 표시하지 않음
  if (loading || board.length === 0) return null;

  const displayed = open ? board : board.slice(0, 5);

  return (
    <div className="mt-4 bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 text-sm">
          {isCompletion ? '✨ 최근 참여자' : '🏆 현재 랭킹'}
        </h3>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          TOP {board.length}
        </span>
      </div>

      <div className="space-y-1.5">
        {displayed.map((entry, i) => (
          <div
            key={`${entry.nickname}-${i}`}
            className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm ${
              i < 3 ? 'bg-amber-50' : 'bg-gray-50'
            }`}
          >
            <span className="w-8 text-center font-bold text-xs shrink-0">
              {getRankEmoji(i + 1)}
            </span>
            <span className="flex-1 font-medium truncate text-gray-700">
              {entry.nickname}
            </span>
            {!isCompletion && (
              <span
                className={`font-bold text-xs shrink-0 ${
                  i === 0
                    ? 'text-yellow-600'
                    : i === 1
                    ? 'text-gray-500'
                    : i === 2
                    ? 'text-amber-700'
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
        ))}
      </div>

      {board.length > 5 && (
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full mt-2 py-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          {open ? '접기 ▲' : `전체 ${board.length}명 보기 ▼`}
        </button>
      )}
    </div>
  );
}
