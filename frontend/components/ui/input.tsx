import { forwardRef } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BaseProps = {
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
};

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & BaseProps
>(function Input({ label, hint, error, className, id, ...props }, ref) {
  const inputId = id ?? props.name;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-ink"
        >
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-11 w-full rounded-lg border border-line bg-white px-3.5 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent/60",
          error && "border-danger focus:border-danger focus:ring-danger/30",
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted/70">{hint}</p>
      ) : null}
    </div>
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & BaseProps
>(function Select({ label, hint, error, className, id, children, ...props }, ref) {
  const selectId = id ?? props.name;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label htmlFor={selectId} className="text-sm font-semibold text-ink">
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-11 w-full appearance-none rounded-lg border border-line bg-white px-3.5 text-sm text-ink transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-accent/60",
          error && "border-danger focus:border-danger focus:ring-danger/30",
        )}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p className="text-xs font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted/70">{hint}</p>
      ) : null}
    </div>
  );
});

export function Checkbox({
  label,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className={cn("flex cursor-pointer items-center gap-2.5", className)}>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-line bg-white accent-[#152a24] focus:ring-2 focus:ring-accent/50"
        {...props}
      />
      {label ? <span className="text-sm text-muted">{label}</span> : null}
    </label>
  );
}