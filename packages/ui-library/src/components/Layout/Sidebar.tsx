// packages/ui-library/src/components/Layout/Sidebar.tsx
"use client";

import React from "react";
import { Icon } from "./../Icon/Icon";
import type { IconDefinition } from "./../Icon/Icon";

/**
 * Sidebar types kept tiny and purpose-built for the QGDS accordion markup you’re using.
 */
export type SidebarHeading = {
  label: string;
  /** Kept for backwards compatibility (external links, downloads, etc.) */
  href?: string;
  /** New: client navigation (preserves React context) */
  route?: string;
  icon?: IconDefinition;
};

export type SidebarItem = {
  label: string;
  /** Kept for backwards compatibility (external links, downloads, etc.) */
  href?: string;
  /** New: client navigation (preserves React context) */
  route?: string;
  icon?: IconDefinition;
  items?: SidebarItem[];
};

export type SidebarProps = {
  /** Heading block above the link list (renders as the big title link). */
  heading?: SidebarHeading;
  /** List of items/links. */
  items?: SidebarItem[];
  /** Start accordion open? Default false to keep parity with current classes. */
  defaultOpen?: boolean;
  /**
   * Optional navigation handler for `route` (keeps ui-library Next-agnostic).
   * When provided and `route` is set, we prevent default and call this.
   */
  onNavigate?: (route: string) => void;
};

/**
 * QGDS accordion side nav — props-driven but preserves your exact class names.
 * If `heading`/`items` are not provided, it renders nothing (empty nav shell).
 */
const Sidebar: React.FC<SidebarProps> = ({
  heading,
  items = [],
  defaultOpen = false,
  onNavigate,
}) => {
  const accordionClass = defaultOpen
    ? "qld__accordion__title"
    : "qld__accordion__title qld__accordion--closed";

  const contentClass = defaultOpen
    ? "qld__side-nav__content dcir qld__accordion__body"
    : "qld__side-nav__content dcir qld__accordion--closed qld__accordion__body";

  /**
   * Prefer route → fallback to href → fallback to "#"
   */
  const resolveHref = (route?: string, href?: string) => route ?? href ?? "#";

  /**
   * Client-side navigation while preserving real <a href>.
   * Only intercept when `onNavigate` is provided.
   */
  const handleRouteClick =
    (route?: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!route) return;
      if (typeof onNavigate !== "function") return;

      e.preventDefault();
      onNavigate(route);
    };

  return (
    <div className="qld__side-nav qld__accordion">
      <button
        className={`qld__side-nav__toggle ${accordionClass}`}
        aria-controls="nav-default"
        aria-expanded={defaultOpen ? "true" : "false"}
      >
        {heading?.label ?? "Menu"}
      </button>

      <nav aria-label="side navigation" id="nav-default" className={contentClass}>
        {heading && (
          <h2 className="qld__sidenav__title">
            <a
              className="qld__sidenav__link"
              href={resolveHref(heading.route, heading.href)}
              onClick={handleRouteClick(heading.route)}
            >
              {heading.icon && <Icon icon={heading.icon} aria-hidden="true" />}
              {heading.label}
            </a>
          </h2>
        )}

        {items.length > 0 && (
          <ul className="qld__link-list">
            {items.map((item, idx) => {
              const key = item.route ?? item.href ?? `${item.label}-${idx}`;

              return (
                <li key={key}>
                  <a
                    className="qld__sidenav__link"
                    href={resolveHref(item.route, item.href)}
                    onClick={handleRouteClick(item.route)}
                  >
                    {item.icon && <Icon icon={item.icon} aria-hidden="true" />}
                    {item.label}
                  </a>

                  {item.items && item.items.length > 0 && (
                    <ul className="qld__link-list">
                      {item.items.map((sub, subIdx) => {
                        const subKey = sub.route ?? sub.href ?? `${sub.label}-${subIdx}`;

                        return (
                          <li key={subKey}>
                            <a
                              className="qld__sidenav__link"
                              href={resolveHref(sub.route, sub.href)}
                              onClick={handleRouteClick(sub.route)}
                            >
                              {sub.icon && <Icon icon={sub.icon} aria-hidden="true" />}
                              {sub.label}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
