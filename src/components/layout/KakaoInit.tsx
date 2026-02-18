'use client';

import Script from 'next/script';

/**
 * Kakao JavaScript SDK 초기화 (v2.7.9)
 *
 * SDK 공식 CDN: https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js
 * Integrity: sha384-JpLApTkB8lPskhVMhT+m5Ln8aHlnS0bsIexhaak0jOhAkMYedQoVghPfSpjNi9K1
 *
 * 카카오 개발자 콘솔 설정 필수:
 *   1. https://developers.kakao.com → 내 애플리케이션 선택
 *   2. 앱 설정 → 플랫폼 → Web 플랫폼 추가
 *   3. 사이트 도메인에 배포 URL 등록 (예: https://fortune-hub-phi.vercel.app)
 *   4. .env에 NEXT_PUBLIC_KAKAO_JS_KEY = JavaScript 키 입력
 */
export default function KakaoInit() {
  const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  if (!jsKey) return null;

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js"
      integrity="sha384-JpLApTkB8lPskhVMhT+m5Ln8aHlnS0bsIexhaak0jOhAkMYedQoVghPfSpjNi9K1"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
          window.Kakao.init(jsKey);
        }
      }}
      onError={() => {
        console.warn('[Kakao] SDK 로딩 실패 — 네트워크 상태를 확인하세요.');
      }}
    />
  );
}
