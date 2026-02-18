'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  text: string;
  url?: string;
}

export default function ShareButtons({ title, text, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [kakaoStatus, setKakaoStatus] = useState<'idle' | 'error'>('idle');

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const hasKakaoKey = !!process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {
        // 사용자 취소 무시
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

    // SDK 초기화 여부 확인
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      setKakaoStatus('error');
      setTimeout(() => setKakaoStatus('idle'), 3000);
      handleCopyLink();
      return;
    }

    // 공유 텍스트 가공 (Kakao description 최대 200자)
    const lines = text.split('\n').filter(l => l.trim());
    const firstLine = lines[0] ?? '';
    const hashLine = lines.find(l => l.startsWith('#')) ?? '';
    const rawDesc = hashLine ? `${firstLine} ${hashLine}` : firstLine;
    const description = rawDesc.slice(0, 200);

    try {
      /**
       * Kakao.Share.sendDefault — 기본 템플릿으로 메시지 발송
       * 공식 문서: https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link
       *
       * objectType: 'feed' — 하나의 콘텐츠를 소개하는 피드형 메시지
       * content.imageUrl 생략: 공개된 OG 이미지가 없을 경우 제외
       */
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: title.slice(0, 200),
          description,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '나도 해보기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
    } catch (e) {
      console.error('[Kakao Share] 오류:', e);
      setKakaoStatus('error');
      setTimeout(() => setKakaoStatus('idle'), 3000);
    }
  };

  const handleTwitterShare = () => {
    const firstLine = text.split('\n')[0] ?? '';
    const tweetText = `${title}\n${firstLine}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400 text-center font-medium">결과 공유하기</p>

      {kakaoStatus === 'error' && (
        <p className="text-xs text-center text-orange-500 bg-orange-50 rounded-lg px-3 py-2">
          카카오 연결에 실패했습니다. 링크가 복사됐으니 카카오톡에 직접 붙여넣어 주세요.
        </p>
      )}

      {/* 공유 미리보기 */}
      <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-500 leading-relaxed">
        <p className="font-semibold text-gray-700 mb-1">{title}</p>
        <p className="line-clamp-2">{text.split('\n')[0]}</p>
      </div>

      <div className="flex gap-2 justify-center flex-wrap">
        {/* 기기 공유 (모바일 Safari/Chrome) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            aria-label="기기 공유 기능으로 공유하기"
            className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            공유하기
          </button>
        )}

        {/* 링크 복사 */}
        <button
          onClick={handleCopyLink}
          aria-label="결과 링크 복사하기"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          {copied ? '✓ 복사됨' : '🔗 링크 복사'}
        </button>

        {/* 카카오톡 공유 */}
        {hasKakaoKey && (
          <button
            onClick={handleKakaoShare}
            aria-label="카카오톡으로 공유하기"
            className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-full text-sm font-medium hover:bg-yellow-500 transition-colors"
          >
            💬 카카오톡
          </button>
        )}

        {/* X (트위터) 공유 */}
        <button
          onClick={handleTwitterShare}
          aria-label="X(트위터)에 공유하기"
          className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          𝕏 공유
        </button>
      </div>
    </div>
  );
}
