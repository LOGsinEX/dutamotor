interface BadgeProps {
  variant?: "default" | "success" | "warning" | "info" | "danger" | "soft";
  children: React.ReactNode;
  className?: string;
}

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  const variants: Record<string, string> = {
    default: "bg-surface-soft text-ink-soft border border-line",
    success: "bg-tint-green text-green border border-tint-green",
    warning: "bg-tint-amber text-amber border border-tint-amber",
    info: "bg-tint-blue text-blue border border-tint-blue",
    danger: "bg-brand-soft text-brand border border-brand-soft",
    soft: "bg-surface/85 text-ink border border-line/70 backdrop-blur",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
