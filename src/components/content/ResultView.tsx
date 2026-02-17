'use client';

import { GenerateResultOutput } from '@/engine/types';
import AdSlot from '@/components/ad/AdSlot';
import ShareButtons from '@/components/share/ShareButtons';
import Disclaimer from '@/components/layout/Disclaimer';
import ContentCard from '@/components/content/ContentCard';
import { contentRegistry, getContentBySlug } from '@/content/registry';
import { seedPick, fnv1aHash } from '@/engine/hash';

interface ResultViewProps {
  result: GenerateResultOutput;
  slug: string;
}

function ScoreBar({ score }: { score?: number }) {
  if (!score) return null;
  return (
    <div className="flex gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i <= score ? 'bg-blue-400' : 'bg-gray-100'
          }`}
        />
      ))}
    </div>
  );
}

export default function ResultView({ result, slug }: ResultViewProps) {
  // 추천 콘텐츠 (현재 콘텐츠 제외 2~3개)
  const otherContent = contentRegistry.filter(c => c.slug !== slug);
  const recommended = seedPick(otherContent, fnv1aHash(slug + result.resultKey), 3, 0);

  // 공유 데이터 구성
  const content = getContentBySlug(slug);
  const shareTitle = content
    ? `${content.emoji} ${content.title}`
    : result.shareCard.title;
  const hashTags = result.shareCard.keywords.map(k => `#${k}`).join(' ');
  const shareText = `${result.shareCard.summary}\n\n${hashTags}\n\n나도 해보기 →`;
  const siteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/p/${slug}`
    : `/p/${slug}`;

  // adPolicy 기반 슬롯 provider 결정
  // coupangCount >= 2: B+C 쿠팡 / A AdSense
  // coupangCount == 1: B 쿠팡 / A+C AdSense
  // coupangCount == 0: 전부 AdSense
  const coupangCount = content?.adPolicy?.coupangCount ?? 0;
  const providerB = coupangCount >= 1 ? 'coupang' : 'adsense';
  const providerC = coupangCount >= 2 ? 'coupang' : 'adsense';

  return (
    <div className="space-y-6">
      {/* 요약 블록 */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{result.summary}</h2>
        <div className="flex gap-2 justify-center flex-wrap">
          {result.keywords.map((kw) => (
            <span
              key={kw}
              className="px-3 py-1 bg-white/70 rounded-full text-sm text-blue-600 font-medium"
            >
              #{kw}
            </span>
          ))}
        </div>
        {result.personalDetail && (
          <p className="mt-3 text-sm text-gray-500 italic">
            {result.personalDetail}
          </p>
        )}
      </div>

      {/* Ad Slot A: AdSense (요약 직후 → 높은 노출) */}
      <AdSlot slot="A" provider="adsense" />

      {/* 상세 섹션 */}
      <div className="space-y-3">
        {result.detailSections.map((section, i) => (
          <div key={section.area}>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{section.emoji}</span>
                <h3 className="font-bold text-gray-900 text-sm">{section.label}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{section.text}</p>
              <ScoreBar score={section.score} />
            </div>
            {/* Ad Slot B: 쿠팡 파트너스 (콘텐츠 중간) */}
            {i === 2 && <AdSlot slot="B" provider={providerB as 'adsense' | 'coupang'} className="mt-3" />}
          </div>
        ))}
      </div>

      {/* Do / Avoid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-xs font-bold text-green-600 mb-1">오늘 추천</p>
          <p className="text-sm text-gray-700">{result.doToday}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <p className="text-xs font-bold text-red-500 mb-1">오늘 주의</p>
          <p className="text-sm text-gray-700">{result.avoidToday}</p>
        </div>
      </div>

      {/* 공유 */}
      <ShareButtons
        title={shareTitle}
        text={shareText}
        url={siteUrl}
      />

      {/* 고지 문구 */}
      <Disclaimer />

      {/* Ad Slot C: 쿠팡 or AdSense (추천 콘텐츠 위) */}
      <AdSlot slot="C" provider={providerC as 'adsense' | 'coupang'} />

      {/* 추천 콘텐츠 */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">다른 콘텐츠도 해보세요</h3>
        <div className="space-y-3">
          {recommended.map((c) => (
            <ContentCard key={c.slug} content={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
