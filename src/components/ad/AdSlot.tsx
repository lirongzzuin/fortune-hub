'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  provider?: 'adsense' | 'coupang' | 'none';
  slot: 'A' | 'B' | 'C';
  className?: string;
}

const SLOT_STYLES: Record<string, { minHeight: string; label: string }> = {
  A: { minHeight: '100px', label: '광고 영역 A' },
  B: { minHeight: '120px', label: '광고 영역 B' },
  C: { minHeight: '100px', label: '광고 영역 C' },
};

/**
 * 통합 광고 컴포넌트
 * - provider: adsense | coupang | none
 * - 개발환경: 더미 박스
 * - 프로덕션: ENV 제어로 실제 스크립트 로드
 * - 광고가 없어도 레이아웃 어색하지 않게 minHeight/placeholder 적용
 */
export default function AdSlot({ provider = 'adsense', slot, className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isProd = process.env.NODE_ENV === 'production';
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adsenseSlot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;
  const coupangId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;

  const style = SLOT_STYLES[slot];

  useEffect(() => {
    if (!isProd || !adRef.current) return;

    if (provider === 'adsense' && adsenseId && adsenseSlot) {
      try {
        // @ts-expect-error adsbygoogle global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense not loaded
      }
    }
  }, [isProd, provider, adsenseId, adsenseSlot]);

  if (provider === 'none') return null;

  // 개발 환경: 더미 박스
  if (!isProd) {
    return (
      <div
        className={`my-4 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-xs ${className}`}
        style={{ minHeight: style.minHeight }}
      >
        {provider === 'coupang' ? '쿠팡 파트너스 영역' : `AdSense ${style.label}`}
      </div>
    );
  }

  // 프로덕션 환경: 실제 광고
  if (provider === 'coupang') {
    return (
      <div
        ref={adRef}
        className={`my-4 ${className}`}
        style={{ minHeight: style.minHeight }}
      >
        {coupangId && (
          <>
            <iframe
              src={`https://ads-partners.coupang.com/widgets.html?id=${coupangId}&template=carousel&trackingCode=AF&subId=fortune-hub`}
              width="100%"
              height="100"
              frameBorder="0"
              scrolling="no"
              referrerPolicy="unsafe-url"
              title="쿠팡 파트너스"
            />
            <p className="text-[10px] text-gray-300 text-center mt-1">
              이 광고는 쿠팡 파트너스 활동의 일환으로 수수료를 지급받습니다.
            </p>
          </>
        )}
      </div>
    );
  }

  // AdSense
  return (
    <div
      ref={adRef}
      className={`my-4 ${className}`}
      style={{ minHeight: style.minHeight }}
    >
      {adsenseId && adsenseSlot && (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={adsenseId}
          data-ad-slot={adsenseSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
