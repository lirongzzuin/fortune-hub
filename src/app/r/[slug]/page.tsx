import React from 'react';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getContentBySlug, contentRegistry } from '@/content/registry';
import { generateResult } from '@/engine/generator';
import { parseSearchParams } from '@/lib/utils';
import ResultView from '@/components/content/ResultView';
import TestRunner from '@/components/content/TestRunner';
import QuizRunner from '@/components/content/QuizRunner';
import ReactionTapGame from '@/components/content/ReactionTapGame';
import ColorMemoryGame from '@/components/content/ColorMemoryGame';
import NumberMemoryGame from '@/components/content/NumberMemoryGame';
import BalanceGame from '@/components/content/BalanceGame';
import ScoreTestRunner from '@/components/content/ScoreTestRunner';
import MBTIRunner from '@/components/content/MBTIRunner';
import LoveLangRunner from '@/components/content/LoveLangRunner';
import AttachmentRunner from '@/components/content/AttachmentRunner';
import TarotRunner from '@/components/content/TarotRunner';
import ZodiacRunner from '@/components/content/ZodiacRunner';
import { getQuestionPack } from '@/content/questions';

interface Props {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export function generateStaticParams() {
  return contentRegistry
    .filter((c) =>
      c.type === 'personality-test' ||
      c.type === 'quiz' ||
      c.type === 'game' ||
      c.type === 'balance-game' ||
      c.type === 'score-test' ||
      c.type === 'mbti-test' ||
      c.type === 'love-language' ||
      c.type === 'attachment-style' ||
      c.type === 'tarot' ||
      c.type === 'zodiac'
    )
    .map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const content = getContentBySlug(params.slug);
  if (!content) return {};
  return {
    title: `${content.title} 결과`,
    description: content.description,
  };
}

function BackHeader({ slug, title }: { slug: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/p/${slug}`}
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ←
      </Link>
      <h1 className="text-base font-bold text-gray-900">{title}</h1>
    </div>
  );
}

export default function ResultPage({ params, searchParams }: Props) {
  const content = getContentBySlug(params.slug);
  if (!content) notFound();

  const input = parseSearchParams(searchParams);

  if (content.type === 'fortune' || content.type === 'saju') {
    if (!input.birthdate) {
      redirect(`/p/${params.slug}`);
    }
    const result = generateResult(content, input);
    return (
      <div className="space-y-4">
        <BackHeader slug={params.slug} title={content.title} />
        <ResultView result={result} slug={params.slug} />
      </div>
    );
  }

  if (content.type === 'personality-test') {
    const questionPack = getQuestionPack(params.slug);
    if (!questionPack) notFound();
    return (
      <div className="space-y-4">
        <BackHeader slug={params.slug} title={content.title} />
        <TestRunner questionPack={questionPack} slug={params.slug} />
      </div>
    );
  }

  if (content.type === 'quiz') {
    return (
      <div className="space-y-4">
        <BackHeader slug={params.slug} title={content.title} />
        <QuizRunner slug={params.slug} />
      </div>
    );
  }

  if (content.type === 'game') {
    const gameComponents: Record<string, React.ReactNode> = {
      'reaction-tap': <ReactionTapGame />,
      'color-memory': <ColorMemoryGame />,
      'number-memory': <NumberMemoryGame />,
    };
    const GameComponent = gameComponents[params.slug] ?? <ReactionTapGame />;
    return (
      <div className="space-y-4">
        <BackHeader slug={params.slug} title={content.title} />
        {GameComponent}
      </div>
    );
  }

  if (content.type === 'balance-game') {
    return (
      <div className="space-y-4">
        <BackHeader slug={params.slug} title={content.title} />
        <BalanceGame slug={params.slug} />
      </div>
    );
  }

  if (content.type === 'love-language') {
    return (
      <div className="space-y-4">
        <BackHeader slug={params.slug} title={content.title} />
        <LoveLangRunner />
      </div>
    );
  }

  if (content.type === 'attachment-style') {
    return (
      <div className="space-y-4">
        <BackHeader slug={params.slug} title={content.title} />
        <AttachmentRunner />
      </div>
    );
  }

  if (content.type === 'score-test') {
    return (
      <div className="space-y-4">
        <BackHeader slug={params.slug} title={content.title} />
        <ScoreTestRunner slug={params.slug} />
      </div>
    );
  }

  if (content.type === 'mbti-test') {
    return (
      <div className="space-y-4">
        <BackHeader slug={params.slug} title={content.title} />
        <MBTIRunner />
      </div>
    );
  }

  if (content.type === 'tarot') {
    return (
      <div className="space-y-4">
        <BackHeader slug={params.slug} title={content.title} />
        <TarotRunner />
      </div>
    );
  }

  if (content.type === 'zodiac') {
    const birthdate = input.birthdate as string;
    if (!birthdate) redirect(`/p/${params.slug}`);
    return (
      <div className="space-y-4">
        <BackHeader slug={params.slug} title={content.title} />
        <ZodiacRunner birthdate={birthdate} />
      </div>
    );
  }

  notFound();
}
