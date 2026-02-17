'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  provider?: 'adsense' | 'coupang' | 'auto';
  slot: 'A' | 'B' | 'C';
  className?: string;
}

/**
 * 통합 광고 컴포넌트
 *
 * provider:
 *   - 'adsense'  → Google AdSense ins 태그
 *   - 'coupang'  → 쿠팡 파트너스 iframe 위젯
 *   - 'auto'(기본) → coupang 위젯 ID 있으면 coupang, 없으면 adsense
 *
 * 환경변수:
 *   NEXT_PUBLIC_ADSENSE_CLIENT_ID  → 게시자 ID (ca-pub-XXXX)
 *   NEXT_PUBLIC_ADSENSE_SLOT_ID    → 광고 단위 슬롯 ID (숫자만)
 *   NEXT_PUBLIC_COUPANG_PARTNER_ID → 트래킹 코드 (AF4310721 형식)
 *   NEXT_PUBLIC_COUPANG_WIDGET_ID  → 위젯 숫자 ID (쿠팡 대시보드에서 발급)
 */
export default function AdSlot({ provider = 'auto', slot, className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isProd = process.env.NODE_ENV === 'production';

  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adsenseSlotId   = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;
  const coupangPartnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID; // 트래킹코드 (AF...)
  const coupangWidgetId  = process.env.NEXT_PUBLIC_COUPANG_WIDGET_ID;  // 숫자 위젯 ID

  // provider='auto' 해석: 쿠팡 위젯 ID가 있으면 coupang, 없으면 adsense
  const resolvedProvider: 'adsense' | 'coupang' =
    provider === 'auto'
      ? coupangWidgetId ? 'coupang' : 'adsense'
      : provider;

  // AdSense: 마운트 시 push
  useEffect(() => {
    if (!isProd || resolvedProvider !== 'adsense' || !adRef.current) return;
    if (!adsenseClientId || !adsenseSlotId) return;
    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense 스크립트 미로드
    }
  }, [isProd, resolvedProvider, adsenseClientId, adsenseSlotId]);

  // ─── 개발 환경: 더미 박스 ───
  if (!isProd) {
    const label =
      resolvedProvider === 'coupang'
        ? `쿠팡 파트너스 ${slot}${!coupangWidgetId ? ' (위젯 ID 미설정)' : ''}`
        : `AdSense ${slot}${!adsenseClientId ? ' (클라이언트 ID 미설정)' : ''}`;

    return (
      <div
        className={`my-4 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-xs ${className}`}
        style={{ minHeight: slot === 'B' ? '120px' : '100px' }}
      >
        {label}
      </div>
    );
  }

  // ─── 프로덕션: 쿠팡 파트너스 ───
  if (resolvedProvider === 'coupang') {
    // 위젯 ID와 파트너 ID가 모두 있어야 표시
    if (!coupangWidgetId || !coupangPartnerId) return null;

    const widgetUrl =
      `https://ads-partners.coupang.com/widgets.html` +
      `?id=${encodeURIComponent(coupangWidgetId)}` +
      `&template=carousel` +
      `&trackingCode=${encodeURIComponent(coupangPartnerId)}` +
      `&subId=fortune-hub-${slot.toLowerCase()}`;

    return (
      <div ref={adRef} className={`my-4 ${className}`}>
        <iframe
          src={widgetUrl}
          width="100%"
          height="140"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title="쿠팡 파트너스 추천 상품"
          style={{ display: 'block' }}
        />
        <p className="text-[10px] text-gray-300 text-center mt-1">
          이 광고는 쿠팡 파트너스 활동의 일환으로 수수료를 지급받습니다.
        </p>
      </div>
    );
  }

  // ─── 프로덕션: Google AdSense ───
  if (!adsenseClientId || !adsenseSlotId) return null;

  return (
    <div
      ref={adRef}
      className={`my-4 ${className}`}
      style={{ minHeight: slot === 'B' ? '120px' : '100px' }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseClientId}
        data-ad-slot={adsenseSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
