import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  /** optional leading icon */
  icon?: ReactNode;
  /** red ring when the field has a validation error */
  hasError?: boolean;
}

const Input = forwardRef<HTMLInputElement, IProps>(({ icon, hasError, className, ...rest }, ref) => {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
      )}
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-white/10 bg-ink-850/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition",
          "focus:border-violet/60 focus:ring-4 focus:ring-violet/15",
          icon && "pl-11",
          hasError && "border-rose-500/60 focus:border-rose-500/70 focus:ring-rose-500/15",
          className,
        )}
        {...rest}
      />
    </div>
  );
});

export default Input;
