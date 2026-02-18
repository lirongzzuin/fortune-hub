import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <span className="text-white text-base font-bold leading-none">소</span>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">소확잼</span>
        </Link>
      </div>
    </header>
  );
}
