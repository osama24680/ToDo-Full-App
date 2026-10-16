import { cn } from "../../lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { HTMLAttributes, ReactNode } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[.98]",
  {
    variants: {
      variant: {
        // ** FILLED
        default:
          "bg-brand text-ink-900 shadow-glow hover:brightness-110 hover:shadow-[0_0_0_1px_rgba(139,92,246,.4),0_12px_40px_-8px_rgba(139,92,246,.6)]",
        danger:
          "bg-rose-500/90 text-white shadow-[0_10px_30px_-10px_rgba(244,63,94,.6)] hover:bg-rose-500",
        cancel: "bg-white/5 text-slate-300 ring-1 ring-inset ring-white/10 hover:bg-white/10 hover:text-white",

        // ** OUTLINE
        outline:
          "bg-transparent text-slate-200 ring-1 ring-inset ring-violet/40 hover:bg-violet/10 hover:ring-violet/70",

        // ** QUIET (icon buttons in lists)
        ghost: "bg-transparent text-slate-400 hover:bg-white/5 hover:text-white",
      },
      size: {
        default: "px-5 py-3 text-sm",
        sm: "px-4 py-2 text-sm",
        icon: "h-9 w-9 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
  type?: "submit" | "button" | "reset";
}

const Button = ({
  variant,
  size,
  fullWidth,
  isLoading,
  className,
  children,
  type,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
      disabled={isLoading}
    >
      {isLoading ? (
        <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
