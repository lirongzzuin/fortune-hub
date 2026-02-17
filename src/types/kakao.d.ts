// Kakao JavaScript SDK 전역 타입 선언
interface KakaoShareLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoShareContent {
  title: string;
  description?: string;
  imageUrl?: string;
  link: KakaoShareLink;
}

interface KakaoShareButton {
  title: string;
  link: KakaoShareLink;
}

interface KakaoShareDefaultParams {
  objectType: 'feed' | 'list' | 'commerce' | 'text' | 'location';
  content: KakaoShareContent;
  buttons?: KakaoShareButton[];
}

interface KakaoStatic {
  init(appKey: string): void;
  isInitialized(): boolean;
  Share: {
    sendDefault(params: KakaoShareDefaultParams): void;
  };
}

declare global {
  interface Window {
    Kakao: KakaoStatic;
  }
}

export {};
