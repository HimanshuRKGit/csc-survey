import React from "react";

interface FormFieldProps {
  hiLabel: string;
  enLabel: string;
  name: string;
  type?: "text" | "tel" | "number" | "select" | "radio" | "textarea";
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  options?: { value: string; label: string }[];
  className?: string;
}

export function FormField({
  hiLabel,
  enLabel,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  error,
  options = [],
  className = "",
}: FormFieldProps) {
  const fieldId = `field-${name}`;

  return (
    <div className={`mb-5 ${error ? "field-error" : ""} ${className}`}>
      {/* Bilingual Label */}
      <label htmlFor={fieldId} className="block mb-2">
        <span className="block text-base font-semibold text-navy-800 leading-snug">
          {hiLabel}
          {required && <span className="text-error ml-1">*</span>}
        </span>
        <span className="block text-sm text-text-muted mt-0.5">
          {enLabel}
        </span>
      </label>

      {/* Input */}
      {type === "text" || type === "tel" || type === "number" ? (
        <input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          inputMode={type === "tel" ? "tel" : type === "number" ? "numeric" : "text"}
          autoComplete="off"
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
        />
      ) : type === "select" ? (
        <select
          id={fieldId}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
        >
          <option value="">{placeholder || "— चुनें / Select —"}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "radio" ? (
        <div className="radio-group" role="radiogroup" aria-labelledby={fieldId}>
          {options.map((opt) => (
            <label key={opt.value} className="radio-option">
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      ) : type === "textarea" ? (
        <textarea
          id={fieldId}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={3}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
        />
      ) : null}

      {/* Error Message */}
      {error && (
        <p id={`${fieldId}-error`} className="error-message" role="alert">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
