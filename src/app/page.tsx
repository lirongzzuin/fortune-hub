import { contentRegistry, getAllCategories } from '@/content/registry';
import ContentCard from '@/components/content/ContentCard';
import Link from 'next/link';

export default function HomePage() {
  const categories = getAllCategories();
  // 지금 인기: trending 표시된 콘텐츠 (최대 6개)
  const trending = contentRegistry.filter(c => c.trending).slice(0, 6);

  return (
    <div className="space-y-8">
      {/* 히어로 배너 */}
      <section className="-mx-4 -mt-6 bg-gradient-to-br from-primary to-purple-400 px-6 pt-8 pb-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 text-7xl">😈</div>
          <div className="absolute bottom-4 right-24 text-5xl">🚩</div>
          <div className="absolute top-12 right-32 text-4xl">🧬</div>
        </div>
        <div className="relative">
          <p className="text-purple-200 text-xs font-medium mb-1 uppercase tracking-wider">매일 새로운 재미</p>
          <h1 className="text-2xl font-bold leading-tight mb-2">
            나는 어떤 사람일까?<br />테스트로 알아보기
          </h1>
          <p className="text-purple-100 text-sm mb-5">테스트 · 운세 · 퀴즈 · 게임</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/p/hell-balance"
              className="inline-flex items-center gap-1.5 bg-white text-primary font-bold text-sm px-4 py-2.5 rounded-xl shadow-md hover:bg-purple-50 transition-colors active:scale-95"
            >
              😈 밸런스 게임
            </Link>
            <Link
              href="/p/red-flag-test"
              className="inline-flex items-center gap-1.5 bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-white/30 transition-colors active:scale-95 border border-white/30"
            >
              🚩 Red Flag 테스트
            </Link>
          </div>
        </div>
      </section>

      {/* 카테고리 빠른 이동 */}
      <section>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/c/${cat.id}`}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl border border-gray-100 text-sm font-medium text-gray-700 hover:border-primary/40 hover:text-primary transition-colors shadow-sm"
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 인기 콘텐츠 — 가로 스크롤 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">🔥 지금 인기</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4">
          {trending.map((c) => (
            <Link
              key={c.slug}
              href={`/p/${c.slug}`}
              className="flex-shrink-0 w-36 bg-white rounded-2xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all active:scale-[0.97] overflow-hidden"
            >
              <div className="h-20 bg-primary-light flex items-center justify-center">
                <span className="text-4xl">{c.emoji}</span>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">{c.title}</p>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{c.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 카테고리별 전체 목록 */}
      {categories.map((cat) => {
        const items = contentRegistry.filter(c => c.category === cat.id);
        // 테스트 카테고리는 5개까지 노출 (바이럴 콘텐츠 우선)
        const previewCount = cat.id === 'test' ? 5 : 3;
        return (
          <section key={cat.id}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900">
                {cat.emoji} {cat.label}
              </h2>
              <Link
                href={`/c/${cat.id}`}
                className="text-xs text-primary font-medium hover:text-primary-dark transition-colors"
              >
                전체보기 →
              </Link>
            </div>
            <div className="space-y-2.5">
              {items.slice(0, previewCount).map((c) => (
                <ContentCard key={c.slug} content={c} />
              ))}
              {items.length > previewCount && (
                <Link
                  href={`/c/${cat.id}`}
                  className="block text-center py-3 text-sm text-primary font-medium bg-primary-light rounded-xl hover:bg-purple-100 transition-colors"
                >
                  {items.length - previewCount}개 더 보기
                </Link>
              )}
            </div>
          </section>
        );
      })}

      {/* SEO 텍스트 */}
      <section className="text-xs text-gray-400 leading-relaxed space-y-2 pt-4 border-t border-gray-100">
        <p>
          &lsquo;소확잼&rsquo;는 매일 즐길 수 있는 가벼운 콘텐츠 허브입니다.
          생년월일 기반의 오늘의 운세, 1분 사주, 단톡방 역할 유형 테스트,
          회의 포지션 유형 테스트 등 다양한 성격 분석과 유형 테스트를 제공합니다.
        </p>
        <p>
          매일 바뀌는 상식 퀴즈로 지식을 테스트하고, 반응 속도 게임으로 순발력을 확인해보세요.
          모든 콘텐츠는 무료이며, 친구에게 공유하여 함께 즐길 수 있습니다.
        </p>
        <p>
          운세와 성격 테스트 결과는 재미와 참고를 위한 것이며, 전문적인 의학, 법률, 투자 조언이 아닙니다.
        </p>
      </section>
    </div>
  );
}
