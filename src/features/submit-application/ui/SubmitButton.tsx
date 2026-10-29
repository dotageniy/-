interface SubmitButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export function SubmitButton({ disabled, onClick }: SubmitButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl px-6 py-3 text-base font-semibold text-white shadow-fairy-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_25px_60px_-20px_rgba(168,85,247,0.8)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-300/40 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="absolute inset-0 bg-button-fairy" />
      <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] transition-transform duration-1000 group-hover:translate-x-full" />
      <span className="relative flex items-center justify-center gap-2">
        <span>✨</span>
        Оставить волшебную заявку
        <span>✨</span>
      </span>
    </button>
  );
}
