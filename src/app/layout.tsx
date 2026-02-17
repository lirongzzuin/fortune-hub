import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import KakaoInit from '@/components/layout/KakaoInit';
import Script from 'next/script';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '오늘 뭐하지? - 운세, 테스트, 퀴즈, 게임',
    template: '%s | 오늘 뭐하지?',
  },
  description:
    '매일 새로운 운세, 성격 테스트, 상식 퀴즈, 반응 게임을 즐겨보세요. 생년월일 기반 맞춤 운세와 재미있는 유형 테스트를 무료로 제공합니다.',
  keywords: ['운세', '오늘의 운세', '성격 테스트', '심리 테스트', 'MBTI', '퀴즈', '게임', '사주'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '오늘 뭐하지?',
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-3452112216824670" />
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={`${geistSans.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <KakaoInit />
        <Header />
        <main className="max-w-lg mx-auto px-4 py-6 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
