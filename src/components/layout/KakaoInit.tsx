'use client';

import Script from 'next/script';

/**
 * Kakao JavaScript SDK 초기화
 *
 * 공식 SDK URL: https://developers.kakao.com/sdk/js/kakao.js
 * (→ https://t1.kakaocdn.net/kakao_js_sdk/v1/kakao.js 로 리다이렉트됨)
 *
 * 설정 필요:
 *   1. https://developers.kakao.com → 내 애플리케이션 → 앱 설정 → 플랫폼 → Web 추가
 *   2. 사이트 도메인에 배포 URL 등록 (e.g. https://fortune-hub-phi.vercel.app)
 *   3. NEXT_PUBLIC_KAKAO_JS_KEY에 JavaScript 키 입력
 */
export default function KakaoInit() {
  const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  if (!jsKey) return null;

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(jsKey);
          console.log('[Kakao] SDK initialized, key:', jsKey.slice(0, 8) + '...');
        }
      }}
      onError={() => {
        console.warn('[Kakao] SDK 로딩 실패');
      }}
    />
  );
}
