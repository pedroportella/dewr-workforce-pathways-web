// packages/ui-library/src/components/FormFields/SelectInput/SelectInput.tsx
import React from "react";
import classNames from "../../../utils/classNames";
import { FormFieldWrapper } from "../FormFieldWrapper/FormFieldWrapper";
import type { SelectOption } from "../../../types/select";

type SelectInputProps = {
  id: string;
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: readonly SelectOption[];
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  hint?: string;
  error?: string;
  success?: string;
  filled?: boolean;
  width?: string; // e.g., 'md', 'lg', 'full'
  /** Browser autocomplete hint */
  autoComplete?: React.SelectHTMLAttributes<HTMLSelectElement>["autoComplete"];
};

export const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  multiple = false,
  hint,
  error,
  success,
  filled = false,
  width = "full",
  autoComplete = "off",
}) => {
  const selectClass = classNames("qld__select-control", "qld__text-input--block", `qld__field-width--${width}`, {
    "qld__text-input--error": !!error,
    "qld__text-input--valid": !!success,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    onChange(multiple ? selected : selected[0]);
  };

  return (
    <FormFieldWrapper
      id={id}
      label={label}
      required={required}
      hint={hint}
      error={error}
      success={success}
      filled={filled}>
      <div className="qld__select">
        <select
          id={id}
          data-testid={id}
          name={id}
          value={value}
          multiple={multiple}
          disabled={disabled}
          required={required}
          className={selectClass}
          onChange={handleChange}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : undefined}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </FormFieldWrapper>
  );
};

export default SelectInput;
