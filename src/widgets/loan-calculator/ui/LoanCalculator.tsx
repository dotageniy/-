import { useMemo, useState } from "react";
import { LoanTypeChips } from "@/features/loan-type-select/ui/LoanTypeChips";
import { AmountSlider } from "@/features/loan-amount/ui/AmountSlider";
import { TermSlider } from "@/features/loan-term/ui/TermSlider";
import { SubmitButton } from "@/features/submit-application/ui/SubmitButton";
import { useLoanCalculatorPush } from "@/features/loan-application/model/useLoanCalculatorPush";
import { loanApplicationSchema, type LoanApplication } from "@/entities/applicant";
import { calculateLoan, isIncomeSufficient } from "@/entities/loan";
import { LOAN_PRODUCTS, type LoanTypeId } from "@/shared/config/loanProducts";
import { formatCurrency, formatNumber, parseFormattedNumber } from "@/shared/lib/format";

interface FormDraft {
  loanType: LoanTypeId;
  amount: number;
  termMonths: number;
  fullName: string;
  monthlyIncome: number;
  hasCitizenship: boolean;
  consentGiven: boolean;
}

const INITIAL_DRAFT: FormDraft = {
  loanType: "mortgage",
  amount: 5_000_000,
  termMonths: 120,
  fullName: "",
  monthlyIncome: 0,
  hasCitizenship: false,
  consentGiven: false,
};

export function LoanCalculator() {
  const [draft, setDraft] = useState<FormDraft>(INITIAL_DRAFT);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const product = LOAN_PRODUCTS[draft.loanType];

  const result = useMemo(
    () =>
      calculateLoan({
        loanType: draft.loanType,
        amount: clamp(draft.amount, product.minAmount, product.maxAmount),
        termMonths: clamp(draft.termMonths, product.minTermMonths, product.maxTermMonths),
        annualRate: product.annualRate,
      }),
    [draft.loanType, draft.amount, draft.termMonths, product],
  );

  const validation = loanApplicationSchema.safeParse(draft);
  const isValid = validation.success;

  const errors = useMemo(() => {
    const map: Partial<Record<keyof LoanApplication, string>> = {};
    if (validation.success) return map;
    for (const issue of validation.error.issues) {
      const key = issue.path[0] as keyof LoanApplication;
      if (!map[key]) map[key] = issue.message;
    }
    return map;
  }, [validation]);

  const showError = (field: keyof LoanApplication) =>
    touched[field] ? errors[field] : undefined;

  const incomeSufficient = isIncomeSufficient(draft.monthlyIncome, result.monthlyPayment);

  const setField = <K extends keyof FormDraft>(field: K, value: FormDraft[K]) =>
    setDraft((prev) => ({ ...prev, [field]: value }));

  const { push, status: pushStatus, error: pushError, reset: resetPush } = useLoanCalculatorPush();

  const handleSubmit = () => {
    if (!isValid || pushStatus === "submitting") return;
    const app = validation.success ? validation.data : null;
    if (!app) return;
    void push(app);
  };

  return (
    <section className="relative grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="pointer-events-none absolute -left-10 -top-14 hidden h-24 w-24 animate-float lg:block">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 rounded-[40%_60%_55%_45%/55%_45%_55%_45%] bg-gradient-to-br from-violet-200/40 via-fuchsia-200/30 to-amber-100/40 blur-2xl" />
          <svg viewBox="0 0 64 64" className="relative h-full w-full drop-shadow-[0_20px_60px_rgba(168,85,247,0.25)]">
            <path
              d="M32 6L38 20H52L41 29L45 43L32 34L19 43L23 29L12 20H26L32 6Z"
              fill="url(#castleStar)"
            />
            <defs>
              <linearGradient id="castleStar" x1="12" y1="6" x2="52" y2="43" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fef3c7" />
                <stop offset="0.6" stopColor="#fbbf24" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <form
        className="relative space-y-6 overflow-hidden rounded-[28px] border border-white/70 bg-card-gradient p-6 shadow-fairy-glow ring-1 ring-violet-100/60 backdrop-blur sm:p-8"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-gradient-to-br from-fuchsia-200/40 via-violet-200/30 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-amber-200/30 via-pink-200/20 to-transparent blur-3xl" />
        <div className="relative flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-violet-500/80">Волшебная анкета</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-800 sm:text-2xl">Расскажите о своей мечте</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold text-fuchsia-500 shadow-fairy-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-star-glow" />
            Исполним желание
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-700">
            ФИО волшебного героя
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={draft.fullName}
            onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
            onChange={(e) => setField("fullName", e.target.value)}
            placeholder="Иванов Иван Иванович"
            className="w-full rounded-2xl border border-violet-100/80 bg-white/80 px-4 py-2.5 text-slate-800 shadow-inner shadow-violet-100/40 transition focus:border-fuchsia-400 focus:outline-none focus:ring-4 focus:ring-fuchsia-200/40"
          />
          {showError("fullName") && (
            <p className="mt-2 text-xs font-medium text-rose-500">{errors.fullName}</p>
          )}
        </div>

        <AmountSlider
          value={draft.amount}
          min={product.minAmount}
          max={product.maxAmount}
          error={showError("amount")}
          onChange={(amount) => {
            setTouched((t) => ({ ...t, amount: true }));
            setField("amount", amount);
          }}
        />

        <TermSlider
          value={draft.termMonths}
          min={product.minTermMonths}
          max={product.maxTermMonths}
          error={showError("termMonths")}
          onChange={(termMonths) => {
            setTouched((t) => ({ ...t, termMonths: true }));
            setField("termMonths", termMonths);
          }}
        />

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Выбери тип волшебного кредита</h2>
            <span className="text-xs text-violet-500/80">Нежные условия</span>
          </div>
          <LoanTypeChips
            value={draft.loanType}
            onChange={(loanType) => {
              const p = LOAN_PRODUCTS[loanType];
              setDraft((prev) => ({
                ...prev,
                loanType,
                amount: clamp(prev.amount, p.minAmount, p.maxAmount),
                termMonths: clamp(prev.termMonths, p.minTermMonths, p.maxTermMonths),
              }));
            }}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="income" className="mb-2 block text-sm font-semibold text-slate-700">
              Ежемесячный доход, ₽
            </label>
            <input
              id="income"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={draft.monthlyIncome === 0 ? "" : formatNumber(draft.monthlyIncome)}
              onBlur={() => setTouched((t) => ({ ...t, monthlyIncome: true }))}
              onChange={(e) => {
                const parsed = parseFormattedNumber(e.target.value);
                setField("monthlyIncome", Number.isNaN(parsed) ? 0 : parsed);
              }}
              placeholder="100 000"
              className="w-full rounded-2xl border border-violet-100/80 bg-white/80 px-4 py-2.5 text-right text-slate-800 shadow-inner shadow-violet-100/40 transition focus:border-fuchsia-400 focus:outline-none focus:ring-4 focus:ring-fuchsia-200/40"
            />
            {showError("monthlyIncome") && (
              <p className="mt-2 text-xs font-medium text-rose-500">{errors.monthlyIncome}</p>
            )}
            {touched.monthlyIncome && draft.monthlyIncome > 0 && !incomeSufficient && (
              <p className="mt-2 text-xs font-medium text-amber-600">
                ✨ Доход чуть недостаточен: нужно не менее {formatCurrency(result.requiredIncome)}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/70 bg-white/70 p-4 shadow-fairy-soft sm:p-5">
          <p className="text-sm font-semibold text-slate-700">Волшебные согласия</p>
          <label className="flex items-start gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.hasCitizenship}
              onChange={(e) => setField("hasCitizenship", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-lg border-violet-200 accent-fuchsia-500"
            />
            <span>
              Я являюсь гражданином РФ
              {showError("hasCitizenship") && (
                <span className="block text-xs font-medium text-rose-500">{errors.hasCitizenship}</span>
              )}
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={draft.consentGiven}
              onChange={(e) => setField("consentGiven", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded-lg border-violet-200 accent-fuchsia-500"
            />
            <span>
              Я даю согласие на обработку персональных данных в соответствии с{" "}
              <a
                href="/privacy-policy.pdf"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text font-semibold text-transparent underline decoration-fuchsia-300/70 underline-offset-4 hover:decoration-fuchsia-400"
                target="_blank"
                rel="noreferrer noopener"
              >
                политикой конфиденциальности
              </a>{" "}
              (152-ФЗ)
              {showError("consentGiven") && (
                <span className="block text-xs font-medium text-rose-500">{errors.consentGiven}</span>
              )}
            </span>
          </label>
        </div>
      </form>

      <aside className="relative h-fit overflow-hidden rounded-[28px] border border-white/10 bg-sidebar-gradient p-6 text-white shadow-fairy-glow ring-1 ring-violet-300/30 sm:p-7">
        <div className="pointer-events-none absolute -top-20 right-0 h-40 w-40 rounded-full bg-gradient-to-br from-violet-300/30 via-fuchsia-300/20 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-6 h-44 w-44 rounded-full bg-gradient-to-tr from-amber-300/18 via-pink-300/14 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="relative">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-violet-200/80">
              Волшебный прогноз
            </h2>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-twinkle-slow rounded-full bg-amber-200 shadow-star-glow" />
              <span className="h-1.5 w-1.5 animate-twinkle-fast rounded-full bg-pink-200" />
              <span className="h-1.5 w-1.5 animate-twinkle-slow rounded-full bg-violet-200" style={{ animationDelay: "0.8s" }} />
            </div>
          </div>
          <p className="text-sm text-violet-100/80">Расчёт по продукту «{product.title}»</p>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-violet-400/20 backdrop-blur">
            <p className="text-sm text-violet-100/80">Ежемесячный платёж</p>
            <p className="mt-1 text-4xl font-bold tracking-tight" data-testid="monthly-payment">
              {formatCurrency(result.monthlyPayment)}
            </p>
            <p className="mt-2 text-xs text-violet-200/70">Платёж наполнен волшебством, расчёт точен</p>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl px-1 py-1">
              <dt className="text-violet-100/80">Количество платежей</dt>
              <dd className="font-semibold">{formatNumber(result.paymentsCount)}</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl px-1 py-1">
              <dt className="text-violet-100/80">Ставка</dt>
              <dd className="font-semibold">
                {(product.annualRate * 100).toLocaleString("ru-RU")}%
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-xl px-1 py-1">
              <dt className="text-violet-100/80">Требуемая зарплата</dt>
              <dd className="font-semibold" data-testid="required-income">
                от {formatCurrency(result.requiredIncome)}
              </dd>
            </div>
            <div className="flex items-center justify-between rounded-xl px-1 py-1">
              <dt className="text-violet-100/80">Общая сумма выплат</dt>
              <dd className="font-semibold">{formatCurrency(result.totalRepaid)}</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl px-1 py-1">
              <dt className="text-violet-100/80">Переплата</dt>
              <dd className="font-semibold text-amber-200">{formatCurrency(result.totalInterest)}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <SubmitButton
              disabled={!isValid || pushStatus === "submitting"}
              onClick={handleSubmit}
            />
          </div>
          {!isValid && (
            <p className="mt-3 text-center text-xs text-violet-200/70">
              Собери все звёздочки: заполни поля и подтверди согласия
            </p>
          )}
          {pushStatus === "submitting" && (
            <p className="mt-3 text-center text-xs text-violet-200/70" data-testid="push-status">
              Заклинание отправки… Скоро свяжемся!
            </p>
          )}
          {pushStatus === "success" && (
            <div className="mt-4 rounded-2xl border border-emerald-300/40 bg-emerald-400/20 p-4 text-center text-sm text-emerald-100 shadow-[0_0_60px_-20px_rgba(52,211,153,0.8)]" data-testid="push-status">
              <p className="font-semibold">✨ Заявка на «{product.title}» принята!</p>
              <p className="mt-1 text-xs text-emerald-100/80">Феи-кредиторы свяжутся с тобой после рассмотрения</p>
            </div>
          )}
          {pushStatus === "error" && (
            <div className="mt-4 rounded-2xl border border-rose-300/40 bg-rose-400/20 p-4 text-center text-sm text-rose-100" data-testid="push-status">
              <p>{pushError}</p>
              <button type="button" onClick={resetPush} className="mt-2 underline decoration-rose-200/70 underline-offset-4">
                Попробовать заклинание снова
              </button>
            </div>
          )}
        </div>
      </aside>
    </section>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
