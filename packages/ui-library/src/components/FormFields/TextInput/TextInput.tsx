// packages/ui-library/src/components/FormFields/TextInput/TextInput.tsx
import React from "react";
import classNames from "../../../utils/classNames";
import { FormFieldWrapper } from "../FormFieldWrapper/FormFieldWrapper";

type TextInputProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  width?: string; // e.g. 'md', 'lg', 'full'
  filled?: boolean;
  type?: "text" | "number" | "email" | "password" | "tel" | "date";
  /** Soft keyboard hint for mobile devices (e.g., 'tel', 'numeric', 'email') */
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  /** Browser autocomplete hint (e.g., 'tel', 'email', 'name', 'one-time-code') */
  autoComplete?: React.InputHTMLAttributes<HTMLInputElement>["autoComplete"];
  /** HTML pattern attribute for client-side validation */
  pattern?: string;
  /** Non-blocking alert/warning message (renders with qld__input--alert) */
  alert?: string;
};

export const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  success,
  hint,
  width = "full",
  filled = false,
  type = "text",
  inputMode,
  autoComplete = "off",
  pattern,
  alert,
}) => {
  const inputClass = classNames("qld__text-input", `qld__field-width--${width}`, "qld__text-input--block", {
    "qld__text-input--error": !!error,
    "qld__text-input--valid": !!success,
    "qld__text-input--alert": !!alert,
  });

  return (
    <FormFieldWrapper
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      success={success}
      filled={filled}
      alert={alert}>
      <input
        id={id}
        data-testid={id}
        type={type}
        className={inputClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        inputMode={inputMode}
        autoComplete={autoComplete}
        pattern={pattern}
      />
    </FormFieldWrapper>
  );
};

export default TextInput;
