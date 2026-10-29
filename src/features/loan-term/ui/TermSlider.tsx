import { useId } from "react";
import { formatNumber, parseFormattedNumber } from "@/shared/lib/format";

interface TermSliderProps {
  value: number;
  min: number;
  max: number;
  error?: string;
  onChange: (termMonths: number) => void;
}

function formatTerm(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${plural(years, "год", "года", "лет")}`);
  if (rest > 0) parts.push(`${rest} ${plural(rest, "месяц", "месяца", "месяцев")}`);
  return parts.join(" ") || "0 месяцев";
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** Поле срока кредита: range + input в месяцах */
export function TermSlider({ value, min, max, error, onChange }: TermSliderProps) {
  const id = useId();
  const clamped = Math.min(Math.max(value, min), max);
  const fillPercent = max > min ? ((clamped - min) / (max - min)) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
          Срок исполнения мечты
        </label>
        <span className="text-xs font-medium text-violet-500/80">В месяцах</span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="relative">
          <input
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={formatNumber(value)}
            onChange={(e) => {
              const parsed = parseFormattedNumber(e.target.value);
              if (!Number.isNaN(parsed)) onChange(parsed);
              else if (e.target.value.trim() === "") onChange(0);
            }}
            className="w-full rounded-2xl border border-violet-100/80 bg-white/80 px-4 py-2.5 pr-14 text-right text-lg font-semibold text-slate-800 shadow-inner shadow-violet-100/40 transition focus:border-fuchsia-400 focus:outline-none focus:ring-4 focus:ring-fuchsia-200/40"
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-violet-500/80">
            мес
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={clamped}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(90deg, rgba(192,132,252,0.9) ${fillPercent}%, rgba(244,114,182,0.25) ${fillPercent}%)`,
          }}
          data-fill-percent={fillPercent}
          className="range-fairy h-2 w-full cursor-pointer"
          aria-label="Срок кредита слайдером"
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        От {min} до {max} мес • {formatTerm(value)}
      </p>
      {error && <p className="mt-2 text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}
