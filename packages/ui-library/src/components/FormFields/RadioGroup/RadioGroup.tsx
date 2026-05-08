// packages/ui-library/src/components/FormFields/RadioGroup/RadioGroup.tsx
import React, { PropsWithChildren } from "react";
import classNames from "../../../utils/classNames";

type RadioOption = {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
};

type RadioGroupProps = PropsWithChildren<{
  id: string;
  legend?: string;
  name: string;
  selectedValue: string;
  onChange: (value: string) => void;
  options?: RadioOption[];
  required?: boolean;
  hint?: string;
  error?: string;
  success?: string;
  filled?: boolean;
}>;

export const RadioGroup: React.FC<RadioGroupProps> = ({
  id,
  legend,
  name,
  selectedValue,
  onChange,
  options,
  required = false,
  hint,
  error,
  success,
  filled = false,
  children,
  ...props
}) => {
  const wrapperClass = classNames("qld__form-group", {
    "qld__form-style-filled": filled,
  });

  return (
    <fieldset
      id={id}
      data-testid={id}
      className={wrapperClass}
      role="radiogroup"
      aria-labelledby={`${id}-legend`}
      aria-describedby={error ? `${id}-error` : success ? `${id}-success` : hint ? `${id}-hint` : undefined}
      {...props}>
      {legend && (
        <legend id={`${id}-legend`} className="qld__fieldset__legend">
          {required && <abbr title="required">*</abbr>} {legend}
        </legend>
      )}
      {hint && (
        <span className="qld__hint-text" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="qld__input--error" id={`${id}-error`}>
          {error}
        </span>
      )}
      {success && (
        <span className="qld__input--success" id={`${id}-success`}>
          {success}
        </span>
      )}

      <div className="qld__control-group">
        {options
          ? options.map(({ id: optionId, label, value, disabled }) => (
              <div key={optionId} className="qld__control-input qld__control-input--block">
                <input
                  type="radio"
                  id={optionId}
                  data-testid={optionId}
                  name={name}
                  value={value}
                  checked={selectedValue === value}
                  disabled={disabled}
                  className="qld__control-input__input"
                  onChange={() => onChange(value)}
                />
                <label htmlFor={optionId} className="qld__control-input__text">
                  {label}
                </label>
              </div>
            ))
          : children}
      </div>
    </fieldset>
  );
};

type RadioButtonProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  hintId?: string;
};

export const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  label,
  value,
  checked,
  onChange,
  disabled = false,
  error = false,
  success = false,
  hintId,
}) => {
  const inputClass = classNames("qld__control-input__input", {
    "qld__input--error": error,
    "qld__input--valid": success,
  });

  return (
    <div className="qld__control-input qld__control-input--block">
      <input
        type="radio"
        id={id}
        data-testid={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        className={inputClass}
        onChange={() => onChange(value)}
        aria-describedby={hintId}
      />
      <label htmlFor={id} className="qld__control-input__text">
        {label}
      </label>
    </div>
  );
};
