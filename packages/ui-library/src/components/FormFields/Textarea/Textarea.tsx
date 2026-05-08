// packages/ui-library/src/components/FormFields/Textarea/Textarea.tsx
import React from "react";
import classNames from "../../../utils/classNames";
import { FormFieldWrapper } from "../FormFieldWrapper/FormFieldWrapper";

type TextareaProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  hint?: string;
  /** e.g. 'md', 'lg', 'full' (matches TextInput) */
  width?: string;
  filled?: boolean;
  rows?: number;
  cols?: number;
  /**
   * Hard character limit (HTML attribute).
   * NOTE: Intentionally **not** applied to the underlying <textarea> to allow
   * users to paste long text (we now prefer soft limits + alerts instead).
   */
  maxLength?: number;
  /** Non-blocking alert/warning message (renders with qld__input--alert) */
  alert?: string;
  /** Browser autocomplete hint */
  autoComplete?: React.TextareaHTMLAttributes<HTMLTextAreaElement>["autoComplete"];
};

export const Textarea: React.FC<TextareaProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  success,
  hint,
  width = "full",
  filled = false,
  rows = 3,
  cols,
  alert,
  autoComplete = "off",
}) => {
  const textareaClass = classNames(
    "qld__text-input",
    "qld__text-input--block",
    `qld__field-width--${width}`,
    {
      "qld__text-input--error": !!error,
      "qld__text-input--valid": !!success,
      "qld__text-input--alert": !!alert,
    },
  );

  return (
    <FormFieldWrapper
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      success={success}
      filled={filled}
      alert={alert}
    >
      <textarea
        id={id}
        data-testid={id}
        name={id}
        className={textareaClass}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        rows={rows}
        cols={cols}
        autoComplete={autoComplete}
      />
    </FormFieldWrapper>
  );
};

export default Textarea;
