import { LOAN_PRODUCTS, LOAN_TYPE_IDS, type LoanTypeId } from "@/shared/config/loanProducts";

interface LoanTypeChipsProps {
  value: LoanTypeId;
  onChange: (type: LoanTypeId) => void;
}

export function LoanTypeChips({ value, onChange }: LoanTypeChipsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Тип кредита">
      {LOAN_TYPE_IDS.map((id) => {
        const product = LOAN_PRODUCTS[id];
        const selected = id === value;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(id)}
            className={`group relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              selected
                ? "text-white shadow-fairy-soft"
                : "border border-violet-100/80 bg-white/70 text-slate-700 hover:-translate-y-0.5 hover:shadow-fairy-soft"
            }`}
          >
            {selected && <span className="absolute inset-0 bg-button-fairy" />}
            <span className="relative flex items-center gap-2">
              {product.title}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  selected ? "bg-white/25 text-white" : "bg-violet-100/70 text-violet-600"
                }`}
              >
                {(product.annualRate * 100).toLocaleString("ru-RU")}%
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
