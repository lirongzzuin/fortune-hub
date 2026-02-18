/**
 * Popularity API — leaderboard 테이블의 참여 횟수를 집계해 인기 콘텐츠 순서를 반환합니다.
 * GET /api/popular?limit=<n>
 * Response: { data: [{ slug: string; count: number }] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 3600; // 1시간마다 캐시 갱신

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 50);

  // 모든 game_slug 행 조회 후 클라이언트 사이드에서 집계
  const { data, error } = await supabase
    .from('leaderboard')
    .select('game_slug')
    .limit(10000);

  if (error) {
    console.error('[popular GET]', error);
    return NextResponse.json({ error: 'DB 오류' }, { status: 500 });
  }

  // slug별 참여 횟수 집계
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.game_slug] = (counts[row.game_slug] ?? 0) + 1;
  }

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug, count]) => ({ slug, count }));

  return NextResponse.json({ data: sorted });
}
