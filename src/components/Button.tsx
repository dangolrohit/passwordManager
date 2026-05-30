import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-white text-slate-950 hover:bg-teal-100",
        variant === "secondary" && "glass-field text-slate-100 hover:bg-white/10",
        variant === "danger" && "bg-rose-400/90 text-white hover:bg-rose-300/90",
        className,
      )}
      {...props}
    />
  );
}
