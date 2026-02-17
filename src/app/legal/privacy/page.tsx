import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '소확잼 서비스의 개인정보처리방침입니다.',
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
      <div>
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-xs">← 홈으로</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-3">개인정보처리방침</h1>
        <p className="text-xs text-gray-400 mt-1">시행일: 2026년 2월 1일 &nbsp;|&nbsp; 최종 수정일: 2026년 2월 1일</p>
      </div>

      <p className="text-gray-600">
        &ldquo;소확잼&rdquo;(이하 &ldquo;서비스&rdquo;)는 「개인정보 보호법」을 준수하며,
        이용자의 개인정보를 보호하기 위해 최선을 다합니다.
        본 방침은 서비스가 어떤 정보를 수집하고 어떻게 사용하는지를 안내합니다.
      </p>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">1. 수집하는 개인정보 및 처리 목적</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left">수집 항목</th>
                <th className="border border-gray-200 px-3 py-2 text-left">처리 목적</th>
                <th className="border border-gray-200 px-3 py-2 text-left">보유 기간</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-3 py-2">생년월일 (선택 입력)</td>
                <td className="border border-gray-200 px-3 py-2">운세·사주 결과 생성</td>
                <td className="border border-gray-200 px-3 py-2">처리 후 즉시 파기 (서버 미저장)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-3 py-2">이름 (선택 입력)</td>
                <td className="border border-gray-200 px-3 py-2">결과 개인화 표현</td>
                <td className="border border-gray-200 px-3 py-2">처리 후 즉시 파기 (서버 미저장)</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-3 py-2">게임 최고 기록</td>
                <td className="border border-gray-200 px-3 py-2">개인 기록 표시</td>
                <td className="border border-gray-200 px-3 py-2">이용자 기기 내 로컬 스토리지 (서버 미전송)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500">
          ※ 서비스는 별도의 회원가입 없이 이용 가능하며, 위 정보는 결과 생성 외 다른 목적으로 사용되지 않습니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">2. 제3자 서비스 및 쿠키</h2>
        <p>서비스는 서비스 운영 및 수익화를 위해 다음 제3자 서비스를 사용합니다.</p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex gap-2">
            <span className="font-medium text-gray-700 shrink-0">Google AdSense</span>
            <span>— 맞춤형 광고 제공 목적으로 쿠키를 사용합니다.
              Google의 광고 쿠키 사용 방식은{' '}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Google 개인정보처리방침
              </a>에서 확인할 수 있습니다.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-gray-700 shrink-0">쿠팡 파트너스</span>
            <span>— 제휴 마케팅 광고 제공 목적으로 클릭 추적 쿠키를 사용합니다.
              이용자가 광고를 통해 구매 시 서비스는 수수료를 지급받을 수 있습니다.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-medium text-gray-700 shrink-0">카카오 SDK</span>
            <span>— 카카오톡 공유 기능 제공 목적으로 카카오 JavaScript SDK를 사용합니다.</span>
          </li>
        </ul>
        <p className="text-xs text-gray-500">
          이용자는 브라우저 설정에서 쿠키를 거부하거나 삭제할 수 있으며,
          이 경우 일부 광고 기능에 제한이 생길 수 있습니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">3. 개인정보의 제3자 제공</h2>
        <p>
          서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다.
          단, 법령에 의해 요구되거나 수사기관의 적법한 절차에 의한 경우는 예외로 합니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">4. 이용자의 권리</h2>
        <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>로컬 스토리지에 저장된 게임 기록: 브라우저 설정 → 사이트 데이터 삭제로 직접 삭제 가능</li>
          <li>제3자 광고 쿠키 거부: 브라우저 설정 또는{' '}
            <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              광고 선택 옵트아웃
            </a>을 통해 거부 가능
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">5. 개인정보 보호 책임자 및 문의</h2>
        <p>
          개인정보 처리에 관한 업무를 총괄하며, 개인정보 관련 이의신청 및 피해 구제를 처리합니다.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 text-xs space-y-1 text-gray-600">
          <p><span className="font-medium">개인정보 보호 책임자:</span> 서비스 운영자</p>
          <p><span className="font-medium">문의 방법:</span> 서비스 내 공지 채널 또는 이용약관 페이지 참조</p>
          <p className="text-gray-400 pt-1">
            ※ 개인정보 침해에 관한 신고·상담은 한국인터넷진흥원(KISA) 개인정보침해신고센터
            (privacy.kisa.or.kr / 국번없이 118)에 문의하실 수 있습니다.
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">6. 개인정보처리방침의 변경</h2>
        <p>
          본 방침은 관련 법령 변경이나 서비스 정책에 따라 개정될 수 있으며,
          변경 시 본 페이지를 통해 공지합니다.
        </p>
      </section>
    </div>
  );
}
