import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900 tracking-tight">
          오늘 뭐하지?
        </Link>
        <nav className="flex gap-3 text-sm text-gray-500">
          <Link href="/c/fortune" className="hover:text-gray-900 transition-colors">운세</Link>
          <Link href="/c/test" className="hover:text-gray-900 transition-colors">테스트</Link>
          <Link href="/c/quiz" className="hover:text-gray-900 transition-colors">퀴즈</Link>
          <Link href="/c/game" className="hover:text-gray-900 transition-colors">게임</Link>
        </nav>
      </div>
    </header>
  );
}
