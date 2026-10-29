"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./bs-modal.css";

const OPEN_EVENT = "pcat:modal-open";
const TRANSITION_MS = 300; // .modal.fade .modal-dialog transform transition

/** Source `button[data-bs-toggle=modal]`: opens the Bootstrap modal named by `target`. */
export function BsModalTrigger({ target, className, children }: { target: string; className: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      data-bs-toggle="modal"
      data-bs-target={`#${target}`}
      aria-haspopup="dialog"
      aria-controls={target}
      onClick={(e) => document.getElementById(target)?.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: e.currentTarget }))}
    >
      {children}
    </button>
  );
}

/**
 * Bootstrap 5.1 modal (`.modal.fade > .modal-dialog.modal-lg.modal-dialog-centered`) without
 * Bootstrap JS: display + `.show` with the fade/slide transitions, a `.modal-backdrop`, body scroll
 * lock, Esc, click outside the dialog, `[data-bs-dismiss]` buttons, focus kept inside while open and
 * returned to the trigger on close.
 */
export function BsModal({
  id,
  title,
  children,
}: {
  id: string;
  title: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  // closed -> (display) -> shown; hiding keeps display until the transition ends.
  const [state, setState] = useState<"closed" | "opening" | "shown" | "hiding">("closed");
  const labelId = `${id}Label`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onOpen = (e: Event) => {
      trigger.current = (e as CustomEvent<HTMLElement>).detail;
      setState("opening");
    };
    el.addEventListener(OPEN_EVENT, onOpen);
    return () => el.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const hide = useCallback(() => setState((s) => (s === "closed" ? s : "hiding")), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (state === "opening") {
      // Bootstrap: display first, reflow, then add .show so the fade/slide transitions run.
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setState("shown")));
      return () => cancelAnimationFrame(id);
    }
    if (state === "shown") {
      el.focus();
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      const { overflow, paddingRight } = document.body.style;
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") hide();
      };
      const onFocusIn = (e: FocusEvent) => {
        if (!el.contains(e.target as Node)) el.focus();
      };
      document.addEventListener("keydown", onKey);
      document.addEventListener("focusin", onFocusIn);
      return () => {
        document.body.classList.remove("modal-open");
        document.body.style.overflow = overflow;
        document.body.style.paddingRight = paddingRight;
        document.removeEventListener("keydown", onKey);
        document.removeEventListener("focusin", onFocusIn);
      };
    }
    if (state === "hiding") {
      const t = window.setTimeout(() => {
        setState("closed");
        trigger.current?.focus();
      }, TRANSITION_MS);
      return () => window.clearTimeout(t);
    }
  }, [state, hide]);

  const visible = state !== "closed";
  const shown = state === "shown";

  return (
    <>
      <div
        ref={ref}
        className={cn("modal fade", shown && "show")}
        id={id}
        tabIndex={-1}
        aria-labelledby={labelId}
        aria-hidden={visible ? undefined : true}
        aria-modal={visible || undefined}
        role={visible ? "dialog" : undefined}
        style={visible ? { display: "block" } : undefined}
        // Bootstrap closes on a click on the .modal itself (outside .modal-dialog's content).
        onClick={(e) => {
          if (e.target === e.currentTarget) hide();
        }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={labelId}>
                {title}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={hide} />
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">
              <button type="button" className="btn prayag-modal-close-btn" data-bs-dismiss="modal" onClick={hide}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {visible && <div className="modal-backdrop fade show" style={shown ? undefined : { opacity: 0 }} />}
    </>
  );
}
