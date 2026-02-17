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
import { getQuestionPack } from '@/content/questions';

interface Props {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export function generateStaticParams() {
  return contentRegistry
    .filter((c) => c.type === 'personality-test' || c.type === 'quiz' || c.type === 'game')
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
        <div className="flex items-center gap-2">
          <Link
            href={`/p/${params.slug}`}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ←
          </Link>
          <h1 className="text-base font-bold text-gray-900">{content.title}</h1>
        </div>
        <ResultView result={result} slug={params.slug} />
      </div>
    );
  }

  if (content.type === 'personality-test') {
    const questionPack = getQuestionPack(params.slug);
    if (!questionPack) notFound();
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/p/${params.slug}`}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ←
          </Link>
          <h1 className="text-base font-bold text-gray-900">{content.title}</h1>
        </div>
        <TestRunner questionPack={questionPack} slug={params.slug} />
      </div>
    );
  }

  if (content.type === 'quiz') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/p/${params.slug}`}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ←
          </Link>
          <h1 className="text-base font-bold text-gray-900">{content.title}</h1>
        </div>
        <QuizRunner />
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
        <div className="flex items-center gap-2">
          <Link
            href={`/p/${params.slug}`}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ←
          </Link>
          <h1 className="text-base font-bold text-gray-900">{content.title}</h1>
        </div>
        {GameComponent}
      </div>
    );
  }

  notFound();
}
