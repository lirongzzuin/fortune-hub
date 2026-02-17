import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContentBySlug, contentRegistry } from '@/content/registry';
import InputForm from '@/components/content/InputForm';
import { getCategoryLabel } from '@/lib/utils';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return contentRegistry.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const content = getContentBySlug(params.slug);
  if (!content) return {};
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `${siteUrl}/p/${params.slug}`,
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: `${siteUrl}/p/${params.slug}`,
    },
  };
}

export default function PlayPage({ params }: Props) {
  const content = getContentBySlug(params.slug);
  if (!content) notFound();

  return (
    <div className="space-y-6">
      {/* 뒤로가기 */}
      <Link
        href={`/c/${content.category}`}
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← {getCategoryLabel(content.category)}
      </Link>

      {/* 콘텐츠 소개 */}
      <section className="text-center py-2">
        <span className="text-5xl">{content.emoji}</span>
        <h1 className="text-xl font-bold text-gray-900 mt-3">{content.title}</h1>
        <p className="text-sm text-gray-500 mt-1">{content.subtitle}</p>
      </section>

      {/* 설명 + 입력 폼 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">{content.description}</p>
        {content.questionCount && (
          <div className="flex gap-4 text-xs text-gray-400">
            <span>📋 {content.questionCount}개 문항</span>
            {content.resultCount && <span>🏷️ {content.resultCount}가지 유형</span>}
          </div>
        )}
        {(content.type === 'fortune' || content.type === 'saju') && (
          <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
            ※ 입력하신 생년월일은 결과 생성 후 즉시 파기되며 저장되지 않습니다.
            이 콘텐츠는 오락 목적이며 전문적 조언이 아닙니다.
          </p>
        )}
        <InputForm content={content} />
      </div>
    </div>
  );
}
