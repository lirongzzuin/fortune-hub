'use client';

import { useEffect, useRef, useState } from 'react';

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
 *
 * 빈 공간 방지 전략:
 *   - AdSense: <ins>를 display:block으로 렌더링 후 data-ad-status 감시
 *     → "filled" → 정상 표시 / "unfilled" or 5초 타임아웃 → 숨김
 *   - Coupang: iframe이 항상 140px 높이로 로드
 *   - 환경변수 미설정 → null 반환 (공간 없음)
 */
export default function AdSlot({ provider = 'auto', slot, className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isProd = process.env.NODE_ENV === 'production';

  const adsenseClientId  = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adsenseSlotId    = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;
  const coupangPartnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;
  const coupangWidgetId  = process.env.NEXT_PUBLIC_COUPANG_WIDGET_ID;

  const resolvedProvider: 'adsense' | 'coupang' =
    provider === 'auto'
      ? coupangWidgetId ? 'coupang' : 'adsense'
      : provider;

  // 광고 표시 여부 (default: true → AdSense가 처리할 수 있게 visible 상태로 시작)
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!isProd || resolvedProvider !== 'adsense' || !adRef.current) return;
    if (!adsenseClientId || !adsenseSlotId) return;

    const insEl = adRef.current.querySelector<HTMLElement>('ins.adsbygoogle');
    if (!insEl) return;

    // AdSense에 광고 요청
    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch { /* 스크립트 미로드 시 무시 */ }

    // data-ad-status 속성 감시: "filled" | "unfilled"
    const observer = new MutationObserver(() => {
      const status = insEl.getAttribute('data-ad-status');
      if (status === 'unfilled') setVisible(false);
      else if (status === 'filled') setVisible(true);
    });
    observer.observe(insEl, { attributes: true, attributeFilter: ['data-ad-status'] });

    // 5초 후에도 상태가 없으면 unfilled로 처리 (빈 공간 제거)
    const timeout = setTimeout(() => {
      const status = insEl.getAttribute('data-ad-status');
      if (!status || status === 'unfilled') setVisible(false);
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [isProd, resolvedProvider, adsenseClientId, adsenseSlotId]);

  // ─── 개발 환경 ───
  if (!isProd) {
    const hasCoupang = !!coupangWidgetId && !!coupangPartnerId;
    const hasAdsense = !!adsenseClientId && !!adsenseSlotId;
    const isConfigured = resolvedProvider === 'coupang' ? hasCoupang : hasAdsense;
    // 미설정 시 아무것도 렌더링하지 않음 (빈 공간 없음)
    if (!isConfigured) return null;

    // 설정된 경우 작은 배지만 표시
    return (
      <div className={`my-3 ${className}`}>
        <div className="flex items-center justify-center py-1.5 px-3 bg-gray-100 rounded-lg">
          <span className="text-[10px] text-gray-400">
            {resolvedProvider === 'coupang' ? '쿠팡 파트너스' : 'AdSense'} 광고 영역 {slot}
          </span>
        </div>
      </div>
    );
  }

  // ─── 프로덕션: 쿠팡 파트너스 ───
  if (resolvedProvider === 'coupang') {
    if (!coupangWidgetId || !coupangPartnerId) return null;

    const widgetUrl =
      `https://ads-partners.coupang.com/widgets.html` +
      `?id=${encodeURIComponent(coupangWidgetId)}` +
      `&template=carousel` +
      `&trackingCode=${encodeURIComponent(coupangPartnerId)}` +
      `&subId=fortune-hub-${slot.toLowerCase()}` +
      `&width=680&height=140`;

    return (
      <div ref={adRef} className={`my-3 overflow-hidden ${className}`}>
        <iframe
          src={widgetUrl}
          width="100%"
          height="140"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title="쿠팡 파트너스 추천 상품"
          style={{ display: 'block', maxWidth: '100%' }}
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
    // visible=false 이면 숨김 처리 (margin 포함 빈 공간 없음)
    <div
      ref={adRef}
      className={`${visible ? 'my-3' : 'hidden'} ${className}`}
    >
      {/* <ins>는 항상 display:block 유지 — AdSense가 처리하기 위해 필수 */}
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
