"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "whatsapp"
    | "ghost"
    | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", className = "", children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98] min-h-[44px]";

    const variants: Record<string, string> = {
      primary:
        "bg-gradient-to-r from-brand to-brand-strong text-white hover:brightness-110 shadow-lg shadow-brand/30 hover:shadow-brand/50",
      secondary:
        "bg-ink text-white hover:bg-ink shadow-sm shadow-black/5",
      outline:
        "border border-line bg-surface/60 backdrop-blur text-ink hover:bg-surface-soft hover:border-ink-muted",
      whatsapp:
        "bg-gradient-to-r from-wa to-wa-strong text-white hover:brightness-110 shadow-lg shadow-wa/30 hover:shadow-wa/50",
      ghost: "text-ink-soft hover:bg-surface-soft",
      danger:
        "bg-surface text-brand border border-brand-soft hover:bg-brand-soft",
    };

    const sizes: Record<string, string> = {
      sm: "px-4 py-2 text-sm gap-1.5",
      md: "px-5 py-2.5 text-sm gap-2",
      lg: "px-7 py-3.5 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
