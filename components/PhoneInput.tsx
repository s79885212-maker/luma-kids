"use client";

import { formatUzPhone } from "@/lib/phone";

type Props = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
};

// Поле телефона с маской +998 (90) 123-45-67
export function PhoneInput({ id, name, value, onChange, invalid }: Props) {
  return (
    <input
      id={id}
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      className="field"
      placeholder="+998 (90) 123-45-67"
      value={value}
      aria-invalid={invalid || undefined}
      onFocus={() => {
        if (!value) onChange("+998 (");
      }}
      onBlur={() => {
        if (value.replace(/\D/g, "") === "998") onChange("");
      }}
      onChange={(e) => onChange(formatUzPhone(e.target.value))}
    />
  );
}
