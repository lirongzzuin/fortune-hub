'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const ITEM_H = 44;              // px per row
const VISIBLE = 5;              // visible rows (must be odd)
const PAD = (VISIBLE - 1) / 2; // padding rows above & below = 2

const MONTH_LABELS = [
  '1월','2월','3월','4월','5월','6월',
  '7월','8월','9월','10월','11월','12월',
];

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}

/* ─────────────────────────────────────────
   Wheel 컴포넌트
   circular=true 이면 아이템을 3배로 복제해
   끝에서 처음으로 이어지는 무한 스크롤 제공.
───────────────────────────────────────── */
function Wheel({
  items,
  idx,
  onIdx,
  circular = false,
}: {
  items: string[];
  idx: number;
  onIdx: (i: number) => void;
  circular?: boolean;
}) {
  const ref       = useRef<HTMLDivElement>(null);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const N         = items.length;

  /**
   * circular 모드에서는 아이템을 3벌 복제해 렌더링.
   * 가운데 벌(copy 2)이 기준 위치로 사용됩니다.
   */
  const displayItems = circular
    ? [...items, ...items, ...items]
    : items;

  /**
   * visualIdx: 스크롤 중 실시간으로 업데이트되는 로컬 하이라이트 상태.
   * 부모 idx prop은 디바운스 후에야 업데이트되므로,
   * 이 로컬 state로 스크롤 중 즉각적인 시각 피드백을 제공합니다.
   */
  const [visualIdx, setVisualIdx] = useState(idx);

  /**
   * actualIdx → 스크롤 위치 변환.
   * circular: 가운데 복제본(N ~ 2N-1)을 기준으로 사용.
   */
  const toScrollTop = useCallback(
    (actualIdx: number) =>
      circular ? (N + actualIdx) * ITEM_H : actualIdx * ITEM_H,
    [N, circular],
  );

  /** 스크롤 이동 헬퍼 */
  const goTo = useCallback(
    (actualIdx: number, animate: boolean) => {
      const el = ref.current;
      if (!el) return;
      const top = toScrollTop(actualIdx);
      if (animate) {
        el.scrollTo({ top, behavior: 'smooth' });
      } else {
        el.scrollTop = top;
      }
    },
    [toScrollTop],
  );

  /* 최초 마운트: 초기 위치로 즉시 이동 */
  useEffect(() => {
    goTo(idx, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 외부 idx 변경 시 동기화 (예: 월 변경 → 일 클램핑) */
  const prevExternalIdx = useRef(idx);
  useEffect(() => {
    if (prevExternalIdx.current === idx) return;
    prevExternalIdx.current = idx;
    setVisualIdx(idx);
    goTo(idx, true);
  }, [idx, goTo]);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    /* ① 실시간 하이라이트 (디바운스 없이 즉시) */
    const rawIdx   = Math.round(el.scrollTop / ITEM_H);
    const clipped  = Math.max(0, Math.min(displayItems.length - 1, rawIdx));
    const actualNow = circular ? clipped % N : clipped;
    setVisualIdx(actualNow);

    /* ② 스냅 확정 (150ms 디바운스) */
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      if (!el) return;

      const rawFinal    = Math.round(el.scrollTop / ITEM_H);
      const clippedFinal = Math.max(0, Math.min(displayItems.length - 1, rawFinal));
      const actualFinal  = circular ? clippedFinal % N : clippedFinal;

      prevExternalIdx.current = actualFinal;
      setVisualIdx(actualFinal);
      onIdx(actualFinal);

      const targetTop = toScrollTop(actualFinal);

      if (circular && (clippedFinal < N || clippedFinal >= 2 * N)) {
        /*
         * circular: 1벌 또는 3벌 영역에 걸쳐 있으면
         * 애니메이션 없이 즉시 가운데 벌로 점프.
         * 사용자 눈에는 이음새 없이 이어지는 것처럼 보입니다.
         */
        el.scrollTop = targetTop;
      } else if (Math.abs(el.scrollTop - targetTop) > 2) {
        el.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    }, 150);
  }, [displayItems.length, N, circular, onIdx, toScrollTop]);

  const containerH = ITEM_H * VISIBLE;
  const centerY    = ITEM_H * PAD;

  return (
    <div className="relative flex-1" style={{ height: containerH }}>

      {/* z-0: 선택 영역 강조 바 (스크롤 콘텐츠 뒤) */}
      <div
        className="absolute inset-x-0 z-0 pointer-events-none bg-purple-50 border-y-2 border-purple-200"
        style={{ top: centerY, height: ITEM_H }}
      />

      {/* z-20: 상단 페이드 (스크롤 콘텐츠 앞) */}
      <div
        className="absolute inset-x-0 top-0 z-20 pointer-events-none"
        style={{
          height: centerY,
          background:
            'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/* z-20: 하단 페이드 (스크롤 콘텐츠 앞) */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
        style={{
          height: centerY,
          background:
            'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)',
        }}
      />

      {/*
        z-10: 스크롤 컨테이너
        - z-0 강조 바 위에 위치 (배경 투명) → 중앙에서 강조 바 색상이 보임
        - z-20 페이드 아래에 위치 → 상하단 아이템이 자연스럽게 흐려짐
        - 아이템 텍스트는 강조 바 위에 렌더링됨
      */}
      <div
        ref={ref}
        onScroll={handleScroll}
        className="relative z-10 h-full overflow-y-scroll overscroll-contain"
        style={
          { scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties
        }
      >
        {/* 상단 패딩 (중앙 정렬용) */}
        {Array.from({ length: PAD }).map((_, i) => (
          <div key={`top-${i}`} style={{ height: ITEM_H }} />
        ))}

        {/* 아이템 목록 (circular 시 3배) */}
        {displayItems.map((label, i) => {
          const actualI = circular ? i % N : i;
          return (
            <div
              key={i}
              onClick={() => {
                setVisualIdx(actualI);
                prevExternalIdx.current = actualI;
                goTo(actualI, true);
                onIdx(actualI);
              }}
              className={`flex items-center justify-center cursor-pointer select-none ${
                actualI === visualIdx
                  ? 'text-purple-700 font-bold text-[15px]'
                  : 'text-gray-400 text-sm font-normal'
              }`}
              style={{ height: ITEM_H }}
            >
              {label}
            </div>
          );
        })}

        {/* 하단 패딩 (중앙 정렬용) */}
        {Array.from({ length: PAD }).map((_, i) => (
          <div key={`bot-${i}`} style={{ height: ITEM_H }} />
        ))}
      </div>
    </div>
  );
}

/* ── DateScrollPicker 메인 컴포넌트 ── */
interface Props {
  value: string;                  // YYYY-MM-DD
  onChange: (v: string) => void;
  minYear?: number;
  maxYear?: number;
}

export default function DateScrollPicker({
  value,
  onChange,
  minYear = 1920,
  maxYear,
}: Props) {
  const thisYear = new Date().getFullYear();
  const MAX = maxYear ?? thisYear;

  // 초기값 파싱
  const [yv, mv, dv] = (value || '').split('-').map(Number);
  const safeYear  = yv >= minYear && yv <= MAX ? yv : 1990;
  const safeMonth = mv >= 1 && mv <= 12 ? mv : 1;
  const safeDay   = dv >= 1 ? dv : 1;

  const years  = Array.from({ length: MAX - minYear + 1 }, (_, i) => `${minYear + i}년`);
  const months = MONTH_LABELS;

  const [yearIdx,  setYearIdx]  = useState(safeYear  - minYear);
  const [monthIdx, setMonthIdx] = useState(safeMonth - 1);
  const [dayIdx,   setDayIdx]   = useState(safeDay   - 1);

  const selYear  = minYear + yearIdx;
  const selMonth = monthIdx + 1;
  const maxDays  = daysInMonth(selYear, selMonth);
  const days     = Array.from({ length: maxDays }, (_, i) => `${i + 1}일`);

  // 월/년 변경 시 일 클램핑
  const safeDayIdx = Math.min(dayIdx, maxDays - 1);
  useEffect(() => {
    if (dayIdx > maxDays - 1) setDayIdx(maxDays - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selYear, selMonth]);

  // 날짜 변경 시 부모에게 YYYY-MM-DD 형식으로 전달
  useEffect(() => {
    const y = String(selYear).padStart(4, '0');
    const m = String(selMonth).padStart(2, '0');
    const d = String(safeDayIdx + 1).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearIdx, monthIdx, safeDayIdx]);

  return (
    <div className="flex rounded-2xl border border-gray-200 bg-white overflow-hidden divide-x divide-gray-100">
      {/* 년도: 범위가 넓어 circular 불가 */}
      <Wheel
        items={years}
        idx={yearIdx}
        onIdx={setYearIdx}
        circular={false}
      />
      {/* 월: 12개 고정 → circular */}
      <Wheel
        items={months}
        idx={monthIdx}
        onIdx={setMonthIdx}
        circular
      />
      {/*
        일: 월마다 개수 변동 → days.length 변경 시 key로 리마운트해
        circular 상태를 깔끔하게 초기화합니다.
      */}
      <Wheel
        key={days.length}
        items={days}
        idx={safeDayIdx}
        onIdx={setDayIdx}
        circular
      />
    </div>
  );
}
