"use client";

import type { MouseEvent, ReactNode } from "react";

/**
 * Source `.pt-tile` button: `showModal()`s the `<dialog>` named by its data-target. Focus returns
 * to the tile when the dialog closes (close button, backdrop click or Esc).
 */
export function PtTile({ target, children }: { target: string; children: ReactNode }) {
  const open = (e: MouseEvent<HTMLButtonElement>) => {
    const tile = e.currentTarget;
    const dialog = document.getElementById(target);
    if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;
    dialog.addEventListener("close", () => tile.focus(), { once: true });
    dialog.showModal();
  };
  return (
    <button type="button" className="pt-tile" data-target={target} aria-haspopup="dialog" aria-controls={target} onClick={open}>
      {children}
    </button>
  );
}

/**
 * Source `dialog.pt-fitting-dialog`: header (title + subtitle + close button) and body. As on the
 * source, a click on the dialog element itself (its ::backdrop) closes it; Esc is native.
 */
export function PtDialog({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const labelId = `${id}-title`;
  return (
    <dialog
      id={id}
      className="pt-fitting-dialog"
      aria-labelledby={labelId}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      <div className="pt-dialog-head">
        <div>
          <h3 id={labelId}>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <button
          type="button"
          className="pt-dialog-close"
          aria-label="Close dialog"
          data-pt-close=""
          onClick={(e) => e.currentTarget.closest("dialog")?.close()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div className="pt-dialog-body">{children}</div>
    </dialog>
  );
}
