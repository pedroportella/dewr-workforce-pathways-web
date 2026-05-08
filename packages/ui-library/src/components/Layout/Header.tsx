// packages/ui-library/src/components/Layout/Header.tsx
"use client";

import React from "react";
import { Icon } from "./../Icon/Icon";
import SvgIconsUrl from "@tmr/ui-assets/icons/svg-icons-url";
import qgovLogoUrlBrand from "@tmr/ui-assets/logos/header-logo-qgov-url";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type HeaderCtaItem = {
  label: string;
  href: string;
  icon?: IconDefinition;
};

export type HeaderProps = {
  title?: string;
  items?: HeaderCtaItem[];
  /**
   * Absolute origin (e.g. https://example.gov.au or http://localhost:7001),
   * computed server-side to avoid hydration mismatch.
   */
  baseUrl?: string;
};

const Header: React.FC<HeaderProps> = ({ title = "Portal", items = [], baseUrl = "" }) => {
  return (
    <header className="qld__header" role="banner">
      <nav className="qld__skip-link" aria-label="skip links" tabIndex={-1}>
        <a className="qld__skip-link__link" href="#content">
          Skip to main content
        </a>
        <a className="qld__skip-link__link" href="#qld-header-main-nav">
          Skip to main navigation
        </a>
      </nav>

      <div className="qld__header__pre-header qld__header__pre-header--dark-alt dcir">
        <div className="container-fluid">
          <a
            className="qld__header__brand-image-wrapper"
            rel="noopener noreferrer"
            target="_blank"
            href={baseUrl}
          >
            <span className="qld__header__pre-header-url">{baseUrl}</span>
          </a>

          {items.length > 0 && (
            <div className="qld__header__cta-wrapper">
              {items.map((item) => (
                <a className="qld__header__cta-link" href={item.href} key={item.href}>
                  <span className="qld__header__cta-link-icon">
                    {item.icon && <Icon icon={item.icon} aria-hidden="true" />}
                  </span>
                  <span className="qld__header__cta-link-text">{`${item.label}`}</span>
                </a>
              ))}
            </div>
          )}

          <div className="qld__header__main-nav-controls">
            <button
              aria-controls="qld-header-search"
              className="qld__header__toggle-main-nav qld__main-nav__toggle-search qld__main-nav__toggle-search--open"
              aria-expanded="false"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                className="qld__icon qld__icon--lg qld__main-nav__toggle-search-icon"
              >
                <use href={`${SvgIconsUrl}#qld__icon__search`}></use>
              </svg>
              <svg
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                className="qld__icon qld__icon--lg qld__main-nav__toggle-search-close-icon"
              >
                <use href={`${SvgIconsUrl}#qld__icon__close`}></use>
              </svg>
              <span className="qld__main-nav__toggle-text">Search</span>
            </button>

            <button
              type="button"
              aria-controls="qld-header-main-nav"
              aria-expanded="false"
              className="qld__header__toggle-main-nav qld__main-nav__toggle--open"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                className="qld__icon qld__icon--lg"
              >
                <use href={`${SvgIconsUrl}#qld__icon__mobile-menu`}></use>
              </svg>
              <span className="qld__main-nav__toggle-text">Menu</span>
            </button>
          </div>
        </div>
      </div>

      <div className="qld__header__main qld__header__main--dark">
        <div className="container-fluid">
          <div className="qld__header__brand">
            <a href={baseUrl}>
              <div className="qld__header__brand-image">
                <svg
                  width="170"
                  height="56"
                  viewBox="0 0 170 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                >
                  <title>Queensland Government</title>
                  <use href={`${qgovLogoUrlBrand}`}></use>
                </svg>
              </div>

              <div className="qld__header__site-name">
                <span className="qld__header__heading">{title}</span>
                <span className="qld__header__subline">
                  Transport Analysis Unit
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
