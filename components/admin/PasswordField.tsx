'use client';

import { useState } from 'react';

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoComplete?: string;
};

export default function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  className = 'admin-input',
  autoComplete,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="admin-form-label">{label}</label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${className} pr-20`}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-semibold text-orange-600 hover:text-orange-700"
          aria-pressed={visible}
          aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          {visible ? 'Sembunyikan' : 'Lihat'}
        </button>
      </div>
    </div>
  );
}