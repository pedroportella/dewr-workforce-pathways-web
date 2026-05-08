// packages/ui-library/src/components/Card/Card.tsx
"use client";

import React from "react";
import classNames from "../../utils/classNames";
import { Icon, IconProps } from "../Icon/Icon";
import "./Card.css";

export type CardLink = {
  label: string;
  href?: string;
  route?: string;
  icon?: IconProps["icon"];
  ariaLabel?: string;
};

type CardVariant =
  | "multi-action"
  | "single-action"
  | "single-action-with-footer"
  | "single-click-image"
  | "single-action-icon"
  | "single-action-icon-left"
  | "single-action-arrow"
  | "no-action";

type CardProps = {
  variant?: CardVariant;
  title: string;
  description?: string;
  href?: string;
  route?: string;

  /**
   * Optional navigation handler for `route` (keeps ui-library Next-agnostic).
   * When provided and `route` is set, we prevent default and call this.
   */
  onNavigate?: (route: string) => void;

  /**
   * Accessible label.
   *
   * - If `role` is provided (e.g. `role="button"`), this is applied
   *   to the outer card wrapper.
   * - Otherwise, it is applied to the title link (if `href`/`route` is set).
   */
  ariaLabel?: string;

  imageUrl?: string;
  icon?: IconProps["icon"];
  footerLinks?: CardLink[];
  footerText?: string;

  /**
   * Optional interactive handlers applied to the outer card so
   * consumers don’t need to wrap the card in a separate <div>.
   */
  role?: React.AriaRole;
  tabIndex?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
};

export const Card: React.FC<CardProps> = ({
  variant = "no-action",
  title,
  description,
  href,
  route,
  onNavigate,
  ariaLabel,
  imageUrl,
  icon,
  footerLinks = [],
  footerText,
  role,
  tabIndex,
  onClick,
  onKeyDown,
}) => {
  const cardClass = classNames("qld__card", "dcir__card", {
    "qld__card__multi-action": variant === "multi-action",
    qld__card__action: [
      "single-action",
      "single-action-with-footer",
      "single-click-image",
      "single-action-icon",
      "single-action-icon-left",
      "single-action-arrow",
    ].includes(variant),
    "qld__card--image": variant === "single-click-image",
    "qld__card--icon": ["single-action-icon", "single-action-icon-left"].includes(variant),
    "qld__card--icon-left": variant === "single-action-icon-left",
    "qld__card--arrow": variant === "single-action-arrow",
  });

  // If the card itself has a role (e.g. "button"), use ariaLabel on the outer wrapper.
  // Otherwise, use ariaLabel on the title link (when present).
  const rootAriaLabel = role ? ariaLabel : undefined;
  const linkAriaLabel = !role ? ariaLabel : undefined;

  const resolveHref = (r?: string, h?: string) => r ?? h ?? "#";

  const handleRouteClick =
    (r?: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!r) return;

      if (typeof onNavigate === "function") {
        e.preventDefault();
        onNavigate(r);
      }
      // else: allow normal navigation via href
    };

  const titleNode = route || href ? (
    <a
      href={resolveHref(route, href)}
      aria-label={linkAriaLabel || title}
      aria-describedby={`card-${title}`}
      className="qld__card--clickable__link"
      onClick={handleRouteClick(route)}
    >
      {title}
    </a>
  ) : (
    title
  );

  return (
    <div
      className={cardClass}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label={rootAriaLabel}
    >
      {variant === "single-click-image" && imageUrl && (
        <div
          className="qld__responsive-media-img--bg"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        ></div>
      )}

      {icon && ["single-action-icon", "single-action-icon-left"].includes(variant) && (
        <div className="qld__card__icon">
          <Icon icon={icon} aria-hidden="true" />
        </div>
      )}

      <div className="qld__card__inner">
        <div className="qld__card__content">
          <div className="qld__card__content-inner">
            <h3 className="qld__card__title">{titleNode}</h3>

            {description && (
              <p id={`card-${title}`} className="qld__card__description">
                {description}
              </p>
            )}
          </div>

          {variant === "single-action-arrow" && <div className="qld__card__arrow"></div>}
        </div>

        {/* Footer: Footer Links (multi-action) */}
        {variant === "multi-action" && footerLinks.length > 0 && (
          <div className="qld__card__footer">
            <hr className="qld__horizontal-rule" />
            <div className="qld__card__footer-inner">
              <ul className="qld__link-list">
                {footerLinks.map(({ label, href, route, icon, ariaLabel }, idx) => (
                  <li key={idx}>
                    <a
                      href={resolveHref(route, href)}
                      aria-label={ariaLabel || label}
                      className="qld__card__footer-link qld__card--clickable__link"
                      onClick={handleRouteClick(route)}
                    >
                      {icon && (
                        <Icon
                          icon={icon}
                          className="qld__card__footer-link-icon"
                          aria-hidden="true"
                        />
                      )}
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer: Footer Text (single-action-with-footer) */}
        {variant === "single-action-with-footer" && footerText && (
          <div className="qld__card__footer">
            <hr className="qld__horizontal-rule" />
            <div className="qld__card__footer-inner">{footerText}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
