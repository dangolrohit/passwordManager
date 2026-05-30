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
        variant === "primary" && "bg-teal-500 text-slate-950 hover:bg-teal-400",
        variant === "secondary" && "border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800",
        variant === "danger" && "bg-rose-500 text-white hover:bg-rose-400",
        className,
      )}
      {...props}
    />
  );
}
