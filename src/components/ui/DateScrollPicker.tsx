'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const ITEM_H = 44;   // px
const VISIBLE = 5;   // visible rows
const PAD = 2;       // padding rows above/below

const MONTH_LABELS = [
  '1월','2월','3월','4월','5월','6월',
  '7월','8월','9월','10월','11월','12월',
];

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}

/* ── 단일 스크롤 휠 컬럼 ── */
function Wheel({
  items,
  idx,
  onIdx,
}: {
  items: string[];
  idx: number;
  onIdx: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progRef = useRef(false); // programmatic scroll in progress

  const scrollTo = useCallback(
    (i: number, smooth = true) => {
      if (!ref.current) return;
      ref.current.scrollTo({
        top: i * ITEM_H,
        behavior: smooth ? 'smooth' : ('instant' as ScrollBehavior),
      });
    },
    [],
  );

  // Initial position (no animation)
  useEffect(() => {
    scrollTo(idx, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync when idx changes from outside (e.g. day clamped)
  const prevIdx = useRef(idx);
  useEffect(() => {
    if (prevIdx.current !== idx && !progRef.current) {
      prevIdx.current = idx;
      scrollTo(idx);
    }
  }, [idx, scrollTo]);

  const handleScroll = useCallback(() => {
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      if (!ref.current) return;
      const raw = ref.current.scrollTop / ITEM_H;
      const nearest = Math.max(0, Math.min(items.length - 1, Math.round(raw)));
      progRef.current = true;
      scrollTo(nearest);
      prevIdx.current = nearest;
      onIdx(nearest);
      setTimeout(() => { progRef.current = false; }, 350);
    }, 100);
  }, [items.length, onIdx, scrollTo]);

  const containerH = ITEM_H * VISIBLE;
  const centerTop = ITEM_H * PAD;

  return (
    <div className="relative flex-1 overflow-hidden" style={{ height: containerH }}>
      {/* Centre highlight bar */}
      <div
        className="absolute inset-x-0 z-10 pointer-events-none rounded-xl bg-purple-50 border-y border-purple-100"
        style={{ top: centerTop, height: ITEM_H }}
      />
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 z-20 pointer-events-none"
        style={{
          height: centerTop,
          background: 'linear-gradient(to bottom, white 40%, transparent)',
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
        style={{
          height: centerTop,
          background: 'linear-gradient(to top, white 40%, transparent)',
        }}
      />
      {/* Scrollable list */}
      <div
        ref={ref}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overscroll-contain"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* Top padding */}
        {Array.from({ length: PAD }).map((_, i) => (
          <div key={`pt${i}`} style={{ height: ITEM_H }} />
        ))}
        {/* Items */}
        {items.map((label, i) => (
          <div
            key={i}
            className={`flex items-center justify-center cursor-pointer select-none transition-all ${
              i === idx
                ? 'text-purple-700 font-bold text-base'
                : 'text-gray-400 text-sm font-medium'
            }`}
            style={{ height: ITEM_H }}
            onClick={() => {
              onIdx(i);
              scrollTo(i);
            }}
          >
            {label}
          </div>
        ))}
        {/* Bottom padding */}
        {Array.from({ length: PAD }).map((_, i) => (
          <div key={`pb${i}`} style={{ height: ITEM_H }} />
        ))}
      </div>
    </div>
  );
}

/* ── DateScrollPicker 메인 ── */
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

  // Parse initial value
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

  // Clamp day when month/year changes
  const safeDayIdx = Math.min(dayIdx, maxDays - 1);
  useEffect(() => {
    if (dayIdx > maxDays - 1) setDayIdx(maxDays - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selYear, selMonth]);

  // Emit formatted date
  useEffect(() => {
    const y = String(selYear).padStart(4, '0');
    const m = String(selMonth).padStart(2, '0');
    const d = String(safeDayIdx + 1).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearIdx, monthIdx, safeDayIdx]);

  return (
    <div className="flex rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <Wheel items={years}  idx={yearIdx}    onIdx={setYearIdx} />
      <div className="w-px bg-gray-100 self-stretch" />
      <Wheel items={months} idx={monthIdx}   onIdx={setMonthIdx} />
      <div className="w-px bg-gray-100 self-stretch" />
      <Wheel items={days}   idx={safeDayIdx} onIdx={setDayIdx} />
    </div>
  );
}
