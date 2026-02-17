import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관',
  description: '소확잼 서비스 이용약관입니다.',
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
      <div>
        <Link href="/" className="text-gray-400 hover:text-gray-600 text-xs">← 홈으로</Link>
        <h1 className="text-xl font-bold text-gray-900 mt-3">이용약관</h1>
        <p className="text-xs text-gray-400 mt-1">시행일: 2026년 2월 1일 &nbsp;|&nbsp; 최종 수정일: 2026년 2월 1일</p>
      </div>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">제1조 (목적)</h2>
        <p>
          본 약관은 &ldquo;소확잼&rdquo;(이하 &ldquo;서비스&rdquo;)의 이용 조건 및 절차,
          이용자와 서비스 제공자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">제2조 (서비스의 내용 및 성격)</h2>
        <p>
          서비스는 운세, 성격 테스트, 상식 퀴즈, 반응 속도 게임 등 오락 및 참고 목적의 콘텐츠를 무료로 제공합니다.
        </p>
        <p className="font-medium text-gray-900 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-100">
          ⚠️ 서비스에서 제공하는 모든 콘텐츠(운세, 사주, 성격 테스트 결과 포함)는 순수한
          오락·흥미 목적이며, 어떠한 전문적인 의학·법률·투자·심리 조언도 아닙니다.
          콘텐츠 결과를 근거로 한 판단이나 행동은 전적으로 이용자 본인의 책임입니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">제3조 (이용자의 의무)</h2>
        <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>서비스를 상업적 목적으로 무단 이용하거나 복제·배포하는 행위</li>
          <li>서비스의 안정적인 운영을 방해하는 행위 (과도한 자동 요청, 크롤링 등)</li>
          <li>타인의 개인정보를 무단으로 수집·이용하는 행위</li>
          <li>관련 법령 및 공공질서에 위반되는 행위</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">제4조 (면책 조항)</h2>
        <p>
          서비스는 이용자가 서비스를 통해 기대하는 결과를 보장하지 않습니다.
          콘텐츠 결과를 바탕으로 내린 결정으로 발생한 손해에 대해 서비스는 어떠한 법적 책임도 지지 않습니다.
        </p>
        <p>
          서비스는 천재지변, 인터넷 장애, 시스템 점검 등 불가항력적 사유로 인한
          서비스 중단에 대해 책임을 지지 않습니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">제5조 (광고 및 제휴 마케팅)</h2>
        <p>
          서비스는 Google AdSense 및 쿠팡 파트너스 등 제3자 광고·제휴 서비스를 포함할 수 있습니다.
        </p>
        <p className="text-gray-600">
          쿠팡 파트너스: 서비스는 쿠팡 파트너스 활동의 일환으로 광고를 게재하며, 이용자가 해당 광고를 통해
          구매를 완료하는 경우 일정액의 수수료를 제공받을 수 있습니다.
          광고를 통한 구매·이벤트에 대한 책임은 해당 광고주에게 있습니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">제6조 (지식재산권)</h2>
        <p>
          서비스에서 제공하는 콘텐츠, 디자인, 코드 등에 대한 저작권 및 지식재산권은
          서비스 제공자에게 있습니다. 이용자는 서비스를 통해 얻은 콘텐츠를 무단으로
          복제·배포·상업적 이용해서는 안 됩니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">제7조 (약관의 변경)</h2>
        <p>
          서비스는 관련 법령이나 서비스 정책에 따라 약관을 변경할 수 있으며,
          변경 사항은 서비스 내 공지 또는 본 페이지 갱신을 통해 안내합니다.
          변경된 약관은 공지 후 7일 이후부터 효력이 발생합니다.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-bold text-gray-900">제8조 (준거법 및 관할법원)</h2>
        <p>
          본 약관은 대한민국 법령에 따라 규율되며, 서비스 이용과 관련한 분쟁이 발생하는 경우
          대한민국 법원을 관할 법원으로 합니다.
        </p>
      </section>
    </div>
  );
}
