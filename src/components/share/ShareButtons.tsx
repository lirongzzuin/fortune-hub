'use client';

interface ShareButtonsProps {
  title: string;
  text: string;
  url?: string;
}

export default function ShareButtons({ title, text, url }: ShareButtonsProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

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
      alert('링크가 복사되었습니다!');
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('링크가 복사되었습니다!');
    }
  };

  const handleKakaoShare = () => {
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`;
    window.open(kakaoUrl, '_blank', 'width=600,height=400');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} - ${text}`)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex gap-2 justify-center mt-4">
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          공유하기
        </button>
      )}
      <button
        onClick={handleCopyLink}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
      >
        링크 복사
      </button>
      <button
        onClick={handleKakaoShare}
        className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-full text-sm font-medium hover:bg-yellow-500 transition-colors"
      >
        카카오
      </button>
      <button
        onClick={handleTwitterShare}
        className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        X
      </button>
    </div>
  );
}
