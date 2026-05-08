// packages/ui-library/src/components/Button/Button.tsx
"use client";

import React from "react";
import classNames from "../../utils/classNames";
import "./Button.css";

type Variant = "primary" | "secondary" | "tertiary";

type CommonProps = {
  variant?: Variant;
  /** Disabled state (for <a>, we emulate via aria-disabled + no href) */
  disabled?: boolean;
  /** Optional extra className */
  className?: string;
  id?: string;
  children: React.ReactNode;
  /** Useful for tests */
  "data-testid"?: string;
  /** Click handler (receives the event) */
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  /**
   * Optional navigation handler for `route` (keeps ui-library Next-agnostic).
   * When provided and `route` is set, we prevent default and call this.
   */
  onNavigate?: (route: string) => void;
};

type AnchorProps = CommonProps & {
  href: string;
  route?: never;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  /** `type` is not used for anchors */
  type?: never;
};

type RouteProps = CommonProps & {
  route: string;
  href?: never;
  target?: never;
  rel?: never;
  /** `type` is not used for anchors */
  type?: never;
};

type RealButtonProps = CommonProps & {
  href?: undefined;
  route?: undefined;
  type?: "button" | "submit" | "reset";
};

export type ButtonProps = AnchorProps | RouteProps | RealButtonProps;

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  disabled = false,
  className,
  onClick,
  onNavigate,
  children,
  ...rest
}) => {
  const classes = classNames(
    "qld__btn",
    {
      "qld__btn--primary": variant === "primary",
      "qld__btn--secondary": variant === "secondary",
      "qld__btn--tertiary": variant === "tertiary",
      "qld__btn--disabled": disabled,
    },
    className
  );

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e);
  };

  // Route-style button: still render <a>, intercept when onNavigate is provided.
  if ("route" in rest && typeof rest.route === "string") {
    const { route, id, ["data-testid"]: dataTestId } = rest;

    const handleRouteClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      onClick?.(e);
      if (e.defaultPrevented) return;

      if (typeof onNavigate === "function") {
        e.preventDefault();
        onNavigate(route);
      }
      // else: allow normal navigation via href
    };

    return (
      <a
        id={id}
        className={classes}
        role="button"
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        href={disabled ? undefined : route}
        onClick={handleRouteClick}
        data-testid={dataTestId}
      >
        {children}
      </a>
    );
  }

  // Anchor-style button
  if ("href" in rest && typeof rest.href === "string") {
    const { href, target, rel, id, ["data-testid"]: dataTestId } = rest;
    return (
      <a
        id={id}
        className={classes}
        role="button"
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        href={disabled ? undefined : href}
        target={target}
        rel={rel}
        onClick={handleClick}
        data-testid={dataTestId}
      >
        {children}
      </a>
    );
  }

  // Real <button> (kept for submit/reset)
  const { type = "button", id, ["data-testid"]: dataTestId } = rest as RealButtonProps;

  return (
    <button
      id={id}
      className={classes}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      data-testid={dataTestId}
    >
      {children}
    </button>
  );
};

export default Button;
