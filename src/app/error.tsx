'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-16 space-y-4">
      <p className="text-6xl">⚠️</p>
      <h1 className="text-2xl font-bold text-gray-900">문제가 발생했어요</h1>
      <p className="text-sm text-gray-500">
        잠시 후 다시 시도하거나 홈으로 돌아가주세요.
      </p>
      <div className="flex gap-3 justify-center mt-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold hover:opacity-90 transition-opacity"
        >
          다시 시도
        </button>
        <a
          href="/"
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
        >
          홈으로
        </a>
      </div>
    </div>
  );
}
