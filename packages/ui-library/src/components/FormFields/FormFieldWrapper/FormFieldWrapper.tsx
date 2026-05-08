// packages/ui-library/src/components/FormFields/FormFieldWrapper/FormFieldWrapper.tsx
"use client";
import React from "react";
import classNames from "../../../utils/classNames";

type FormFieldWrapperProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  success?: string;
  filled?: boolean;
  children: React.ReactNode;
  inputDescribedBy?: string; // additional IDs to append to aria-describedby
  /** Non-blocking alert/warning message (e.g. yellow QGDS alert) */
  alert?: string;
};

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  id,
  label,
  required = false,
  hint,
  error,
  success,
  filled = false,
  children,
  inputDescribedBy,
  alert,
}) => {
  const wrapperClass = classNames("qld__form-group", {
    "qld__form-style-filled": filled,
  });

  const describedBy = [
    error ? `${id}-error` : undefined,
    success ? `${id}-success` : undefined,
    alert ? `${id}-alert` : undefined,
    hint ? `${id}-hint` : undefined,
    inputDescribedBy,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass} data-testid={`${id}-wrapper`}>
      <label htmlFor={id} className="qld__label">
        {required && <abbr title="required">*</abbr>} {label}
      </label>

      {hint && (
        <span className="qld__hint-text" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {alert && (
        <span className="qld__input--alert" id={`${id}-alert`}>
          {alert}
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

      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<{
              "aria-describedby"?: string;
              "aria-invalid"?: boolean;
            }>, {
              "aria-describedby": describedBy || undefined,
              "aria-invalid": !!error,
            })
          : child,
      )}
    </div>
  );
};

export default FormFieldWrapper;
