import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentByCategory, getAllCategories } from '@/content/registry';
import ContentCard from '@/components/content/ContentCard';
import { getCategoryLabel } from '@/lib/utils';

interface Props {
  params: { category: string };
}

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const label = getCategoryLabel(params.category);
  return {
    title: `${label} - 소확잼`,
    description: `${label} 카테고리의 모든 콘텐츠를 확인해보세요. 매일 새로운 재미를 제공합니다.`,
  };
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  fortune:
    '생년월일 기반 오늘의 운세와 1분 사주로 하루의 흐름을 확인해보세요. 매일 조금씩 달라지는 조언과 함께 가벼운 마음으로 하루를 시작할 수 있습니다. 총운, 연애운, 금전운, 업무운, 컨디션까지 한눈에 확인 가능합니다.',
  test:
    '나의 숨겨진 유형을 발견해보세요. 단톡방에서의 역할, 회의에서의 포지션 등 일상 속 재미있는 유형 분석을 제공합니다. 친구와 결과를 비교하며 함께 즐길 수 있는 성격 테스트입니다.',
  quiz:
    '매일 새롭게 출제되는 상식 퀴즈에 도전해보세요. 같은 날에는 같은 문제가 출제되어 친구와 점수를 비교할 수 있습니다. 다양한 분야의 지식을 가볍게 테스트해보세요.',
  game:
    '반응 속도 게임으로 순발력을 측정해보세요. 최고 기록에 도전하고, 결과를 친구와 공유할 수 있습니다. 가벼운 게임으로 잠깐의 휴식을 즐겨보세요.',
};

export default function CategoryPage({ params }: Props) {
  const items = getContentByCategory(params.category);
  const categories = getAllCategories();
  const cat = categories.find(c => c.id === params.category);

  if (!cat || items.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* 카테고리 헤더 */}
      <section className="-mx-4 -mt-6 bg-gradient-to-br from-primary to-purple-400 px-6 pt-7 pb-8 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
            {cat.emoji}
          </div>
          <div>
            <h1 className="text-xl font-bold">{cat.label}</h1>
            <p className="text-purple-200 text-xs mt-0.5">{items.length}개 콘텐츠</p>
          </div>
        </div>
      </section>

      <div className="space-y-2.5">
        {items.map((c) => (
          <ContentCard key={c.slug} content={c} />
        ))}
      </div>

      <section className="text-xs text-gray-400 leading-relaxed pt-4 border-t border-gray-100">
        <p>{CATEGORY_DESCRIPTIONS[params.category] || ''}</p>
      </section>
    </div>
  );
}
