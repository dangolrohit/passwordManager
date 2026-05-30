import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field(props: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <input
        className="glass-field h-10 rounded-md px-3 text-slate-100 outline-none transition focus:border-teal-300"
        {...inputProps}
      />
    </label>
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const { label, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <textarea
        className="glass-field min-h-24 rounded-md px-3 py-2 text-slate-100 outline-none transition focus:border-teal-300"
        {...inputProps}
      />
    </label>
  );
}
