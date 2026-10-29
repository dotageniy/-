import { useId } from "react";
import { formatCurrency, formatNumber, parseFormattedNumber } from "@/shared/lib/format";

interface AmountSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  error?: string;
  onChange: (amount: number) => void;
}

/** Поле ввода суммы: range + input с форматированием "1 000 000" */
export function AmountSlider({ value, min, max, step = 10_000, error, onChange }: AmountSliderProps) {
  const id = useId();
  const clamped = Math.min(Math.max(value, min), max);
  const fillPercent = max > min ? ((clamped - min) / (max - min)) * 100 : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700">
          Сумма мечты
        </label>
        <span className="text-xs font-medium text-violet-500/80">Волшебный объём</span>
      </div>
      <div className="flex flex-col gap-3">
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
          className="w-full rounded-2xl border border-violet-100/80 bg-white/80 px-4 py-2.5 text-right text-lg font-semibold text-slate-800 shadow-inner shadow-violet-100/40 transition focus:border-fuchsia-400 focus:outline-none focus:ring-4 focus:ring-fuchsia-200/40"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(90deg, rgba(192,132,252,0.9) ${fillPercent}%, rgba(244,114,182,0.25) ${fillPercent}%)`,
          }}
          data-fill-percent={fillPercent}
          className="range-fairy h-2 w-full cursor-pointer"
          aria-label="Сумма кредита слайдером"
        />
      </div>
      <p className="mt-2 text-xs text-slate-500">
        От {formatCurrency(min)} до {formatCurrency(max)}
      </p>
      {error && <p className="mt-2 text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}
