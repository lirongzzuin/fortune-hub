/**
 * Global Leaderboard API
 *
 * Supabase 테이블 생성 SQL (Supabase 대시보드 > SQL Editor에서 실행):
 *
 * CREATE TABLE public.leaderboard (
 *   id         BIGSERIAL PRIMARY KEY,
 *   game_slug  TEXT NOT NULL,
 *   nickname   TEXT NOT NULL,
 *   score      INTEGER NOT NULL,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * CREATE INDEX idx_leaderboard_game_score ON public.leaderboard (game_slug, score);
 *
 * ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Anyone can read" ON public.leaderboard FOR SELECT USING (true);
 * CREATE POLICY "Anyone can insert" ON public.leaderboard FOR INSERT WITH CHECK (true);
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 게임별 설정: 점수 순서 (asc = 낮을수록 좋음, desc = 높을수록 좋음), 최대 점수 범위
const GAME_CONFIG: Record<string, { order: 'asc' | 'desc'; maxScore: number }> = {
  'reaction-tap':  { order: 'asc',  maxScore: 9999  }, // 반응속도 ms (낮을수록 좋음)
  'color-memory':  { order: 'desc', maxScore: 100   }, // 기억 단계 (높을수록 좋음)
  'number-memory': { order: 'desc', maxScore: 30    }, // 자릿수 (높을수록 좋음)
};

/** GET /api/leaderboard?game=reaction-tap — 상위 20명 조회 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const game = searchParams.get('game');

  if (!game || !GAME_CONFIG[game]) {
    return NextResponse.json({ error: '유효하지 않은 게임입니다.' }, { status: 400 });
  }

  const { order } = GAME_CONFIG[game];

  // 전체 기록 조회 후 닉네임별 최고 기록만 추출
  const { data, error } = await supabase
    .from('leaderboard')
    .select('nickname, score, created_at')
    .eq('game_slug', game)
    .order('score', { ascending: order === 'asc' })
    .limit(500); // 닉네임 중복 제거를 위해 여유 있게 조회

  if (error) {
    console.error('[leaderboard GET]', error);
    return NextResponse.json({ error: 'DB 오류' }, { status: 500 });
  }

  // 닉네임별 최고 기록 추출 (중복 제거)
  const bestPerNickname = new Map<string, { score: number; created_at: string }>();
  for (const row of data ?? []) {
    const existing = bestPerNickname.get(row.nickname);
    const isBetter =
      !existing ||
      (order === 'asc' ? row.score < existing.score : row.score > existing.score);
    if (isBetter) {
      bestPerNickname.set(row.nickname, { score: row.score, created_at: row.created_at });
    }
  }

  const top20 = Array.from(bestPerNickname.entries())
    .map(([nickname, { score, created_at }]) => ({ nickname, score, created_at }))
    .sort((a, b) => (order === 'asc' ? a.score - b.score : b.score - a.score))
    .slice(0, 20);

  return NextResponse.json({ data: top20 });
}

/** POST /api/leaderboard — 점수 등록 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const { game_slug, nickname, score } = body as {
    game_slug: string;
    nickname: string;
    score: number;
  };

  const config = GAME_CONFIG[game_slug];
  if (!config) {
    return NextResponse.json({ error: '유효하지 않은 게임입니다.' }, { status: 400 });
  }

  const trimmedNickname = String(nickname ?? '').trim().slice(0, 10) || '익명';

  if (typeof score !== 'number' || score < 0 || score > config.maxScore) {
    return NextResponse.json({ error: '유효하지 않은 점수입니다.' }, { status: 400 });
  }

  const { error } = await supabase.from('leaderboard').insert({
    game_slug,
    nickname: trimmedNickname,
    score,
  });

  if (error) {
    console.error('[leaderboard POST]', error);
    return NextResponse.json({ error: 'DB 오류' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
