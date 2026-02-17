'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  text: string;
  url?: string;
}

export default function ShareButtons({ title, text, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [kakaoError, setKakaoError] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const hasKakaoKey = !!process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {
        // 사용자가 취소
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKakaoShare = () => {
    if (typeof window === 'undefined') return;

    // Kakao SDK 초기화 여부 확인
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      // SDK 미로드 상태: 링크 복사로 대체 안내
      setKakaoError(true);
      setTimeout(() => setKakaoError(false), 3000);
      handleCopyLink();
      return;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `소확잼 - ${title}`,
        description: text,
        imageUrl: siteUrl ? `${siteUrl}/og-image.png` : undefined,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '결과 보기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} - ${text}`)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 text-center font-medium">결과 공유하기</p>
      {kakaoError && (
        <p className="text-xs text-center text-orange-500">
          카카오 SDK 로딩 중입니다. 링크를 복사해 카카오톡에 붙여넣어 주세요.
        </p>
      )}
      <div className="flex gap-2 justify-center flex-wrap">
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            aria-label="기기 공유 기능으로 공유하기"
            className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            공유하기
          </button>
        )}
        <button
          onClick={handleCopyLink}
          aria-label="결과 링크 복사하기"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          {copied ? '✓ 복사됨' : '링크 복사'}
        </button>
        {hasKakaoKey && (
          <button
            onClick={handleKakaoShare}
            aria-label="카카오톡으로 공유하기"
            className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-full text-sm font-medium hover:bg-yellow-500 transition-colors"
          >
            카카오톡
          </button>
        )}
        <button
          onClick={handleTwitterShare}
          aria-label="X(트위터)에 공유하기"
          className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          X 공유
        </button>
      </div>
    </div>
  );
}
