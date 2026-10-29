import { LoanCalculator } from "@/widgets/loan-calculator/ui/LoanCalculator";

export function CalculatorPage() {
  return (
    <main className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="relative h-24 w-[520px]">
          <div className="absolute left-10 top-6 h-2 w-2 animate-twinkle-slow rounded-full bg-amber-200 shadow-star-glow" />
          <div className="absolute left-24 top-2 h-1.5 w-1.5 animate-twinkle-fast rounded-full bg-fuchsia-200" />
          <div className="absolute left-40 top-10 h-2 w-2 animate-twinkle-slow rounded-full bg-violet-200" style={{ animationDelay: "1s" }} />
          <div className="absolute right-40 top-4 h-1.5 w-1.5 animate-twinkle-fast rounded-full bg-amber-100" style={{ animationDelay: "1.6s" }} />
          <div className="absolute right-24 top-12 h-2 w-2 animate-twinkle-slow rounded-full bg-pink-200" style={{ animationDelay: "0.8s" }} />
          <div className="absolute right-10 top-6 h-1.5 w-1.5 animate-twinkle-fast rounded-full bg-violet-100" style={{ animationDelay: "2s" }} />
        </div>
      </div>
      <header className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-1 text-sm font-semibold text-violet-600 shadow-fairy-soft backdrop-blur">
          <span className="animate-pulse">✨</span>
          Волшебный кредитный зал
          <span className="animate-pulse">✨</span>
        </div>
        <h1 className="relative mx-auto max-w-3xl text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent">
            Кредитный калькулятор
          </span>
          <span className="mt-2 block text-lg font-semibold text-slate-600 sm:text-xl">
            Мечтай. Планируй. Исполняй желания с волшебством
          </span>
        </h1>
        <p className="mt-4 text-base text-slate-600">
          Нежный, уютный и немного сказочный расчёт, чтобы твоя мечта стала совсем близко
        </p>
      </header>
      <LoanCalculator />
      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>Сделано с волшебством и добрыми намерениями ✨</p>
      </footer>
    </main>
  );
}
