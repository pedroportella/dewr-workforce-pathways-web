// packages/ui-library/src/components/Combobox/Combobox.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import classNames from "../../utils/classNames";
import "./Combobox.css";
import { Icon } from "./../Icon/Icon";

export type ComboboxItem = unknown;

type RenderItemArgs<T> = {
  item: T;
  isActive: boolean;
  query: string;
};

type ComboboxProps<T> = {
  /** Label for screen readers (visible label is optional via `label` prop outside) */
  ariaLabel: string;
  /** Placeholder for the input */
  placeholder?: string;
  /** Current input value (uncontrolled if omitted) */
  value?: string;
  /** Called when the input text changes */
  onChange?: (val: string) => void;
  /** Items to render in the dropdown */
  items: T[] | null | undefined;
  /** Unique key for each item */
  getKey: (item: T) => string;
  /** Render function for an item (you control markup) */
  renderItem: (args: RenderItemArgs<T>) => React.ReactNode;
  /** Called when the user selects an item */
  onSelect: (item: T) => void;
  /** Loading state (shows spinner) */
  loading?: boolean;
  /** Error string (optional) */
  error?: string | null;
  /** Message when no results */
  emptyMessage?: string;
  /** Open the menu by default (optional) */
  defaultOpen?: boolean;
  /** Optional test id */
  "data-testid"?: string;
  /** Additional className */
  className?: string;
  /** Disable input */
  disabled?: boolean;

  /** Sprite href, e.g. QldIconsUrl, used for <use href="...#icon"> like FileUpload */
  iconSpriteHref: string;
};

export function Combobox<T>({
  ariaLabel,
  placeholder = "",
  value,
  onChange,
  items,
  getKey,
  renderItem,
  onSelect,
  loading = false,
  error = null,
  emptyMessage = "No results found",
  defaultOpen = false,
  className,
  disabled = false,
  "data-testid": dataTestId,
  iconSpriteHref,
}: ComboboxProps<T>) {
  const [internalValue, setInternalValue] = useState(value ?? "");
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const text = value ?? internalValue;

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current && !inputRef.current) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (inputRef.current?.contains(t)) return;
      setIsOpen(false);
      setActiveIndex(-1);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const hasList = !!items && items.length > 0;
  const showDropdown = isOpen && (hasList || loading || error || (!loading && !error && text.length > 0));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (onChange) onChange(v);
    else setInternalValue(v);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return;
    const count = items?.length ?? 0;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((idx) => (count === 0 ? -1 : Math.min(idx + 1, count - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((idx) => (count === 0 ? -1 : Math.max(idx - 1, 0)));
    } else if (e.key === "Enter") {
      if (count > 0 && activeIndex >= 0 && activeIndex < count) {
        e.preventDefault();
        const chosen = items![activeIndex];
        onSelect(chosen);
        setIsOpen(false);
        setActiveIndex(-1);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const ariaExpanded = showDropdown ? true : false;
  const listId = "overflow-menu-autocomplete";

  const classes = classNames("qld__combobox-form--wrapper", "qld__overflow_menu_wrapper", className);

  return (
    <div className={classes} data-testid={dataTestId}>
      {/* NOTE: No nested <form>. Use a div wrapper to avoid form-inside-form hydration errors. */}
      <div className="oh-autocomplete-label-wrapper qld__margin-t-none" role="search" aria-label={ariaLabel}>
        <div className="qld__margin-t-p qld__search-form__inner">
          <span className={classNames("oh-loading-wheel", loading ? "show" : "hide")} />
          {!loading && (
            <Icon className="qld__search-icon" icon={faMagnifyingGlass} />
          )}
          <input
            ref={inputRef}
            id="searchInput"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            autoComplete="off"
            value={text}
            onFocus={() => setIsOpen(true)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            aria-controls={listId}
            aria-expanded={ariaExpanded}
            aria-haspopup="listbox"
            className="qld__text-input qld__text-input--block"
            aria-label={ariaLabel}
            placeholder={placeholder}
            disabled={disabled}
          />
          {showDropdown && (
            <div className="qld__overflow_menu qld__accordion--open">
              <ul
                id={listId}
                role="listbox"
                aria-label="Search suggestions"
                className="qld__overflow_menu_list"
                ref={menuRef}
              >
                {error && (
                  <li className="qld__overflow_menu_list-item">
                    <p className="qld__input--error qld__padding-y-sm qld__padding-x-sm">Something went wrong. Please try again.</p>
                  </li>
                )}
                {!error && !loading && !hasList && text.length > 0 && (
                  <li className="qld__overflow_menu_list-item">
                    <p className="oh-hospital-search-form__autocomplete-interaction__p">
                      <svg
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-hidden="true"
                        focusable="false"
                        className="qld__flex-shrink-0 qld__icon qld__icon--lead qld__icon--sm"
                      >
                        <use href={`${iconSpriteHref}#icon-status-error`}></use>
                      </svg>
                      <span>{emptyMessage}</span>
                    </p>
                  </li>
                )}
                {items?.map((item, idx) => {
                  const key = getKey(item);
                  const isActive = idx === activeIndex;
                  return (
                    <li key={key} className="qld__overflow_menu_list-item">
                      <a
                        tabIndex={0}
                        role="option"
                        aria-selected={isActive ? "true" : "false"}
                        className={classNames("qld__overflow_menu_list-item-link", {
                          "qld__overflow_menu_list-item-link--active": isActive,
                        })}
                        href="#"
                        onMouseDown={(e) => {
                          // prevent input blur before click
                          e.preventDefault();
                          onSelect(item);
                          setIsOpen(false);
                          setActiveIndex(-1);
                        }}
                        onMouseEnter={() => setActiveIndex(idx)}
                      >
                        {renderItem({ item, isActive, query: text })}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Combobox;
