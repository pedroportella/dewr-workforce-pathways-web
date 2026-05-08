"use client";

import React, { useId, useMemo, useState } from "react";
import classNames from "../../utils/classNames";

export type AccordionTheme = "light" | "alt" | "dark" | "dark-alt";

export type AccordionItem = {
  /** Unique id used for aria-controls + body id (must be unique on the page) */
  id?: string;
  title: React.ReactNode;
  body: React.ReactNode;
  /** Optional extra class on the accordion root */
  className?: string;
};

type BaseProps = {
  /** Optional wrapper class */
  className?: string;

  /** Optional id for the accordion group wrapper */
  groupId?: string;

  /** Matches QGDS modifier classes on qld__accordion-group */
  theme?: AccordionTheme;

  /**
   * If true, render the "Open all / Close all" toggle.
   * Defaults to true when there is more than 1 item.
   */
  showToggleAll?: boolean;

  /**
   * Default open panels (by item id).
   * If provided, this wins over defaultOpen/defaultOpenAll.
   */
  defaultOpenIds?: string[];

  /**
   * Convenience: for group mode, open ALL items by default.
   * Ignored if defaultOpenIds is provided (defaultOpenIds wins).
   */
  defaultOpenAll?: boolean;

  /**
   * Convenience: for single mode, open the only item by default.
   * Ignored if defaultOpenIds is provided (defaultOpenIds wins).
   */
  defaultOpen?: boolean;

  /**
   * If false, behaves like “single-open” (opening one closes others).
   * QGDS generally allows multiple open, so default is true.
   */
  allowMultipleOpen?: boolean;

  /** Heading level for titles (QGDS examples use h2) */
  headingLevel?: 2 | 3 | 4 | 5 | 6;

  /** Labels (optional) */
  openAllLabel?: string;
  closeAllLabel?: string;
};

type GroupProps = BaseProps & {
  items: AccordionItem[];
};

type SingleCompatProps = BaseProps & {
  /** Backwards-compat with previous Accordion usage */
  title?: React.ReactNode;
  children?: React.ReactNode;
  items?: never;
};

export type AccordionProps = GroupProps | SingleCompatProps;

/** -------- helpers -------- */

const isGroupProps = (p: AccordionProps): p is GroupProps =>
  "items" in p && Array.isArray((p as GroupProps).items);

const toGroupModifierClass = (theme?: AccordionTheme) => {
  switch (theme) {
    case "dark":
      return "qld__accordion-group--dark";
    case "dark-alt":
      return "qld__accordion-group--dark-alt";
    case "alt":
      return "qld__accordion-group--alt";
    case "light":
    default:
      // QGDS “light” = base class only
      return undefined;
  }
};

/** -------- component -------- */

export const Accordion: React.FC<AccordionProps> = (props) => {
  const reactId = useId();

  const headingLevel = props.headingLevel ?? 2;
  const headingTagMap: Record<2 | 3 | 4 | 5 | 6, "h2" | "h3" | "h4" | "h5" | "h6"> = {
    2: "h2",
    3: "h3",
    4: "h4",
    5: "h5",
    6: "h6",
  };
  const HeadingTag = headingTagMap[headingLevel];

  /**
   * Normalise into an array of AccordionItem
   * – supports legacy single-accordion usage
   */
  const items: AccordionItem[] = useMemo(() => {
    if (isGroupProps(props)) return props.items;

    return [
      {
        id: `${reactId}-item-1`,
        title: props.title ?? "Accordion heading",
        body: props.children,
      },
    ];
  }, [props, reactId]);

  /**
   * Ensure every item has a stable id
   */
  const resolvedItems = useMemo(
    () =>
      items.map((it, idx) => ({
        ...it,
        id: it.id ?? `${reactId}-item-${idx + 1}`,
      })),
    [items, reactId]
  );

  const allowMultipleOpen = props.allowMultipleOpen ?? true;
  const showToggleAll = props.showToggleAll ?? resolvedItems.length > 1;

  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    // Highest priority: explicit ids
    if (props.defaultOpenIds && props.defaultOpenIds.length > 0) {
      return new Set(props.defaultOpenIds);
    }

    // Convenience: group open-all
    if (props.defaultOpenAll) {
      return new Set(resolvedItems.map((it) => it.id).filter(Boolean));
    }

    // Convenience: single open
    if (!isGroupProps(props) && props.defaultOpen) {
      const firstId = resolvedItems[0]?.id;
      return firstId ? new Set([firstId]) : new Set<string>();
    }

    // Default: CLOSED
    return new Set<string>();
  });

  const allOpen =
    resolvedItems.length > 0 && resolvedItems.every((it) => openIds.has(it.id));

  const toggleOne = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
        return next;
      }

      if (!allowMultipleOpen) next.clear();
      next.add(id);
      return next;
    });
  };

  const openAll = () => setOpenIds(new Set(resolvedItems.map((it) => it.id!)));
  const closeAll = () => setOpenIds(new Set());

  const groupId = props.groupId ?? `${reactId}-accordion-group`;
  const groupThemeClass = toGroupModifierClass(props.theme);

  return (
    <div
      id={groupId}
      className={classNames("qld__accordion-group", "js", groupThemeClass)}
    >
      {showToggleAll && (
        <div className="qld__accordion__toggle">
          <button
            type="button"
            aria-expanded={allOpen ? "true" : "false"}
            className={classNames(
              "qld__accordion__toggle-btn",
              allOpen
                ? "qld__accordion__toggle-btn--open"
                : "qld__accordion__toggle-btn--closed"
            )}
            onClick={allOpen ? closeAll : openAll}
          >
            {allOpen
              ? props.closeAllLabel ?? "Close all"
              : props.openAllLabel ?? "Open all"}
          </button>
        </div>
      )}

      {resolvedItems.map((item, idx) => {
        const isOpen = openIds.has(item.id!);

        return (
          <div
            key={item.id}
            className={classNames(
              "qld__accordion",
              showToggleAll && idx === 0 && "qld__margin-t-p",
              item.className
            )}
          >
            <HeadingTag tabIndex={-1}>
              <button
                type="button"
                aria-controls={item.id}
                aria-expanded={isOpen ? "true" : "false"}
                className={classNames(
                  "qld__accordion__title",
                  "js-qld__accordion",
                  isOpen ? "qld__accordion--open" : "qld__accordion--closed"
                )}
                onClick={() => toggleOne(item.id!)}
              >
                {item.title}
              </button>
            </HeadingTag>

            <div
              id={item.id}
              className={classNames(
                "qld__accordion__body",
                isOpen ? "qld__accordion--open" : "qld__accordion--closed"
              )}
            >
              <div className="qld__accordion__body-wrapper">{item.body}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
