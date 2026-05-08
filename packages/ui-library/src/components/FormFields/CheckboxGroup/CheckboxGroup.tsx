// packages/ui-library/src/components/FormFields/CheckboxGroup/CheckboxGroup.tsx
import React, { PropsWithChildren } from "react";
import classNames from "../../../utils/classNames";

type CheckboxOption = {
  id: string;
  label: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
};

type CheckboxGroupProps = PropsWithChildren<{
  id: string;
  legend?: string;
  name: string;
  /** Supply either `options` or custom `children` with <Checkbox/> items */
  options?: CheckboxOption[];
  onChange: (value: string, checked: boolean) => void;
  required?: boolean;
  hint?: string;
  error?: string;
  success?: string;
  filled?: boolean;
}>;

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  id,
  legend,
  name,
  options,
  onChange,
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
      role="group"
      aria-labelledby={legend ? `${id}-legend` : undefined}
      aria-describedby={
        error ? `${id}-error` : success ? `${id}-success` : hint ? `${id}-hint` : undefined
      }
      {...props}
    >
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
          ? options.map(({ id: optionId, label, value, checked, disabled }) => (
              <div key={optionId} className="qld__control-input qld__control-input--block">
                <input
                  type="checkbox"
                  id={optionId}
                  name={name}
                  value={value}
                  checked={checked}
                  disabled={disabled}
                  className={classNames("qld__control-input__input", {
                    "qld__input--error": !!error,
                    "qld__input--valid": !!success,
                  })}
                  onChange={(e) => onChange(value, e.target.checked)}
                  aria-describedby={
                    error ? `${id}-error` : success ? `${id}-success` : hint ? `${id}-hint` : undefined
                  }
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

type CheckboxProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
  hintId?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({
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
        type="checkbox"
        id={id}
        data-testid={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        className={inputClass}
        onChange={(e) => onChange(value, e.target.checked)}
        aria-describedby={hintId}
      />
      <label htmlFor={id} className="qld__control-input__text">
        {label}
      </label>
    </div>
  );
};

export default CheckboxGroup;
