import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-16 space-y-4">
      <p className="text-6xl">🔮</p>
      <h1 className="text-2xl font-bold text-gray-900">페이지를 찾을 수 없어요</h1>
      <p className="text-sm text-gray-500">
        찾으시는 콘텐츠가 없거나 주소가 잘못되었습니다.
      </p>
      <Link
        href="/"
        className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold hover:opacity-90 transition-opacity"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
