import { contentRegistry, getAllCategories } from '@/content/registry';
import ContentCard from '@/components/content/ContentCard';
import Link from 'next/link';

export default function HomePage() {
  const categories = getAllCategories();
  const featured = contentRegistry.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* 히어로 */}
      <section className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">소확잼</h1>
        <p className="text-sm text-gray-500">
          운세 · 테스트 · 퀴즈 · 게임<br />
          매일 새로운 재미를 만나보세요
        </p>
      </section>

      {/* 추천 콘텐츠 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">오늘의 추천</h2>
        <div className="space-y-3">
          {featured.map((c) => (
            <ContentCard key={c.slug} content={c} />
          ))}
        </div>
      </section>

      {/* 카테고리별 */}
      {categories.map((cat) => {
        const items = contentRegistry.filter(c => c.category === cat.id);
        return (
          <section key={cat.id}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {cat.emoji} {cat.label}
              </h2>
              <Link
                href={`/c/${cat.id}`}
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                더보기
              </Link>
            </div>
            <div className="space-y-3">
              {items.map((c) => (
                <ContentCard key={c.slug} content={c} />
              ))}
            </div>
          </section>
        );
      })}

      {/* SEO 텍스트 */}
      <section className="text-sm text-gray-400 leading-relaxed space-y-2 pt-4 border-t border-gray-100">
        <p>
          &lsquo;소확잼&rsquo;는 매일 즐길 수 있는 가벼운 콘텐츠 허브입니다.
          생년월일 기반의 오늘의 운세, 1분 사주, 단톡방 역할 유형 테스트,
          회의 포지션 유형 테스트 등 다양한 성격 분석과 유형 테스트를 제공합니다.
        </p>
        <p>
          매일 바뀌는 상식 퀴즈로 지식을 테스트하고, 반응 속도 게임으로 순발력을 확인해보세요.
          같은 생년월일이라도 매일 조금씩 다른 결과가 나오기 때문에 매일 방문할 이유가 있습니다.
          모든 콘텐츠는 무료이며, 친구에게 공유하여 함께 즐길 수 있습니다.
        </p>
        <p>
          운세와 성격 테스트 결과는 재미와 참고를 위한 것이며, 전문적인 의학, 법률, 투자 조언이 아닙니다.
          중요한 결정은 반드시 사용자 본인의 판단과 책임 하에 이루어져야 합니다.
          가볍고 즐거운 마음으로 하루를 시작해보세요.
        </p>
      </section>
    </div>
  );
}
