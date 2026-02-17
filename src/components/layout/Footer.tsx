import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-12">
      <div className="max-w-lg mx-auto px-4 py-8 text-center text-xs text-gray-400 space-y-2">
        <div className="flex justify-center gap-4">
          <Link href="/legal/terms" className="hover:text-gray-600 transition-colors">이용약관</Link>
          <Link href="/legal/privacy" className="hover:text-gray-600 transition-colors">개인정보처리방침</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} 소확잼 All rights reserved.</p>
        <p>이 사이트의 모든 콘텐츠는 오락·참고용이며, 전문적 조언이 아닙니다.</p>
        <p>일부 광고는 쿠팡 파트너스 활동의 일환으로 수수료를 지급받을 수 있습니다.</p>
      </div>
    </footer>
  );
}
