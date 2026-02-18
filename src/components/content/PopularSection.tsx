'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { contentRegistry } from '@/content/registry';
import type { ContentEntry } from '@/engine/types';

interface PopularItem {
  slug: string;
  count: number;
}

/**
 * 실제 이용자 참여 횟수를 기반으로 인기 콘텐츠를 가로 스크롤로 노출합니다.
 * 참여 데이터가 없는 경우 trending 플래그로 폴백합니다.
 */
export default function PopularSection() {
  const [items, setItems] = useState<ContentEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/popular?limit=10')
      .then((r) => r.json())
      .then((json: { data?: PopularItem[] }) => {
        const popular = json.data ?? [];
        let ordered: ContentEntry[] = [];

        if (popular.length > 0) {
          // 인기 순서로 contentRegistry에서 매핑 (leaderboard에 없는 항목은 뒤에 추가)
          const slugOrder = popular.map((p) => p.slug);
          const bySlug = new Map(contentRegistry.map((c) => [c.slug, c]));
          const seen = new Set<string>();

          for (const slug of slugOrder) {
            const c = bySlug.get(slug);
            if (c) {
              ordered.push(c);
              seen.add(slug);
            }
          }
          // trending 항목 중 leaderboard에 없는 것을 뒤에 채움
          for (const c of contentRegistry) {
            if (c.trending && !seen.has(c.slug)) {
              ordered.push(c);
            }
          }
        } else {
          // 폴백: trending 플래그
          ordered = contentRegistry.filter((c) => c.trending);
        }

        setItems(ordered.slice(0, 8));
        setLoaded(true);
      })
      .catch(() => {
        // 오류 시 폴백
        setItems(contentRegistry.filter((c) => c.trending).slice(0, 8));
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    // 로딩 스켈레톤
    return (
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-36 h-[120px] bg-gray-100 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
      {items.map((c) => (
        <Link
          key={c.slug}
          href={`/p/${c.slug}`}
          className="flex-shrink-0 w-36 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all active:scale-[0.97] overflow-hidden"
        >
          <div className="h-20 bg-primary-light flex items-center justify-center">
            <span className="text-4xl">{c.emoji}</span>
          </div>
          <div className="p-3">
            <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">{c.title}</p>
            <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{c.subtitle}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
