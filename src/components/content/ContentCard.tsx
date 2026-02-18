import Link from 'next/link';
import { ContentEntry } from '@/engine/types';

interface ContentCardProps {
  content: ContentEntry;
}

export default function ContentCard({ content }: ContentCardProps) {
  return (
    <Link
      href={`/p/${content.slug}`}
      className="block bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all active:scale-[0.98] overflow-hidden"
    >
      <div className="flex items-stretch gap-0">
        {/* 이모지 썸네일 */}
        <div className="w-20 flex-shrink-0 bg-primary-light flex items-center justify-center">
          <span className="text-3xl">{content.emoji}</span>
        </div>
        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0 p-4">
          <h3 className="font-bold text-gray-900 text-[15px] leading-tight">{content.title}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{content.subtitle}</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {content.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[10px] bg-primary-light text-primary rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
        {/* 화살표 */}
        <div className="flex items-center pr-4 text-gray-300">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
