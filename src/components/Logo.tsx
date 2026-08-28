import { cn } from "@/lib/utils";

export function Logo({ className, size = 44 }: { className?: string; size?: number }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="48" height="48" rx="14" fill="var(--color-primary)" />
        <path
          d="M24 10c-5.5 0-10 4.3-10 9.6 0 7 10 18.4 10 18.4s10-11.4 10-18.4C34 14.3 29.5 10 24 10Z"
          fill="var(--color-primary-foreground)"
        />
        <circle cx="24" cy="19.5" r="3.6" fill="var(--color-primary)" />
      </svg>
      <div className="leading-none">
        <p className="font-display text-2xl font-bold tracking-tight text-foreground">Cicero</p>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          peer to peer heritage
        </p>
      </div>
    </div>
  );
}
