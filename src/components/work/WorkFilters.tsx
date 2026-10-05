"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/content/projects";
import { workPage } from "@/content/work";
import { EASE_OUT } from "@/components/ui/motion";
import { useLenis } from "@/components/LenisProvider";
import {
  EMPTY_FILTERS,
  GROUP_KEYS,
  activeCount,
  optionsFor,
  type Filters,
  type GroupKey,
  type Option,
} from "./filters";
import styles from "./WorkFilters.module.css";

const t = workPage.filters;
const VISIBLE_CHIPS = 8;

type Props = {
  projects: Project[];
  filters: Filters;
  onChange: (next: Filters) => void;
  resultCount: number;
};

export function WorkFilters({ projects, filters, onChange, resultCount }: Props) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const lenis = useLenis();

  const count = activeCount(filters);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  // While open: focus the search, close on Escape or a click outside.
  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus({ preventScroll: true });

    // Desktop popover: if it runs past the bottom of the screen, scroll just enough to show it.
    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel || getComputedStyle(panel).position === "fixed") return;
      const overflow = panel.getBoundingClientRect().bottom + 24 - window.innerHeight;
      if (overflow <= 0) return;
      if (lenis) lenis.scrollTo(window.scrollY + overflow);
      else window.scrollBy({ top: overflow });
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, lenis]);

  const toggle = (key: GroupKey, value: string) => {
    const list = filters[key];
    onChange({
      ...filters,
      [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    });
  };

  // Active filters as removable pills.
  const active = [
    ...GROUP_KEYS.flatMap((key) =>
      filters[key].map((value) => ({ id: `${key}:${value}`, label: value, remove: () => toggle(key, value) })),
    ),
    ...(filters.query.trim()
      ? [{ id: "query", label: `“${filters.query.trim()}”`, remove: () => onChange({ ...filters, query: "" }) }]
      : []),
  ];

  return (
    <div className={styles.bar}>
      <div className={styles.controls}>
        <button
          type="button"
          className={`${styles.pill} ${count === 0 ? styles.filled : ""}`}
          aria-pressed={count === 0}
          onClick={() => onChange(EMPTY_FILTERS)}
        >
          {t.all}
        </button>

        <button
          ref={buttonRef}
          type="button"
          className={`${styles.pill} ${open ? styles.filled : ""}`}
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="dialog"
          onClick={() => setOpen((o) => !o)}
        >
          {t.filter}
          {count > 0 && <sup className={styles.sup}>{count}</sup>}
        </button>

        {active.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.pill} ${styles.removable}`}
            aria-label={t.remove(f.label)}
            onClick={f.remove}
          >
            {f.label}
            <span aria-hidden="true" className={styles.x}>
              ×
            </span>
          </button>
        ))}

        <AnimatePresence>
          {open && (
            <>
              {/* Dims the page behind the bottom sheet on small screens (hidden on desktop). */}
              <motion.div
                key="backdrop"
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.div
                key="panel"
                ref={panelRef}
                id={panelId}
                role="dialog"
                aria-label={t.panelLabel}
                className={styles.panel}
                data-lenis-prevent
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
              >
                <label className={styles.search}>
                  <span className="visually-hidden">{t.searchLabel}</span>
                  <input
                    ref={searchRef}
                    type="search"
                    placeholder={t.searchPlaceholder}
                    value={filters.query}
                    onChange={(e) => onChange({ ...filters, query: e.target.value })}
                  />
                </label>

                {GROUP_KEYS.map((key) => (
                  <ChipGroup
                    key={key}
                    label={t.groups[key]}
                    options={optionsFor(projects, key)}
                    selected={filters[key]}
                    onToggle={(value) => toggle(key, value)}
                  />
                ))}

                <div className={styles.actions}>
                  <button type="button" className={styles.pill} onClick={() => onChange(EMPTY_FILTERS)}>
                    {t.clearAll}
                  </button>
                  <button
                    type="button"
                    className={`${styles.pill} ${styles.filled}`}
                    onClick={() => close(true)}
                  >
                    {t.done}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <p className={styles.count} aria-live="polite">
        {workPage.count(resultCount)}
      </p>
    </div>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const labelId = useId();
  if (options.length === 0) return null;

  const hidden = options.length - VISIBLE_CHIPS;
  // Selected chips stay visible even when the group is collapsed.
  const shown =
    expanded || hidden <= 0
      ? options
      : options.filter((o, i) => i < VISIBLE_CHIPS || selected.includes(o.value));

  return (
    <div role="group" aria-labelledby={labelId} className={styles.group}>
      <p id={labelId} className={styles.groupLabel}>
        {label}
      </p>
      <div className={styles.chips}>
        {shown.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`${styles.chip} ${selected.includes(o.value) ? styles.filled : ""}`}
            aria-pressed={selected.includes(o.value)}
            onClick={() => onToggle(o.value)}
          >
            {o.value}
            <sup className={styles.sup}>{o.count}</sup>
          </button>
        ))}
        {hidden > 0 && (
          <button
            type="button"
            className={styles.more}
            aria-expanded={expanded}
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? workPage.filters.less : workPage.filters.more(hidden)}
          </button>
        )}
      </div>
    </div>
  );
}
