import Link from 'next/link';
import { ContentEntry } from '@/engine/types';

interface ContentCardProps {
  content: ContentEntry;
}

export default function ContentCard({ content }: ContentCardProps) {
  return (
    <Link
      href={`/p/${content.slug}`}
      className="block p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{content.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base">{content.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{content.subtitle}</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {content.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] bg-gray-50 text-gray-400 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
