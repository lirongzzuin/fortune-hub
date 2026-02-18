'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '홈', emoji: '🏠', exactMatch: true },
  { href: '/c/fortune', label: '운세', emoji: '🔮', exactMatch: false },
  { href: '/c/quiz', label: '퀴즈', emoji: '🧠', exactMatch: false },
  { href: '/c/game', label: '게임', emoji: '🎮', exactMatch: false },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 safe-area-bottom">
      <div className="max-w-lg mx-auto px-2 h-16 flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exactMatch
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-xl leading-none">{item.emoji}</span>
              <span className={`text-[11px] font-medium ${isActive ? 'text-primary' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
