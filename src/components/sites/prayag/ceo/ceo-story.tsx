"use client";

import { useRef } from "react";

/**
 * Biography list. The source script folds everything after the first `visible` items and
 * adds a "Read the full profile" button that opens the complete text in a native <dialog>
 * (closes on ×, Esc or a backdrop click; page scroll is locked while open). The folded
 * state is rendered on the server so there is no post-hydration layout shift.
 */
export function CeoStory({ items, visible, title }: { items: string[]; visible: number; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const foldable = items.length > visible + 1;

  const open = () => {
    dialogRef.current?.showModal();
    document.body.classList.add("ceo-modal-open");
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  };

  const list = (fold: boolean) => (
    <ul>
      {items.map((text, i) => (
        <li key={i} className={fold && i >= visible ? "is-folded" : undefined}>
          {text}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="ceo-story">
        {list(foldable)}
        {foldable && (
          <button ref={btnRef} type="button" className="ceo-more" aria-haspopup="dialog" onClick={open}>
            Read the full profile
          </button>
        )}
      </div>
      {foldable && (
        <dialog
          ref={dialogRef}
          className="ceo-modal"
          aria-labelledby="ceo-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) e.currentTarget.close(); // click on the dark backdrop
          }}
          onClose={() => {
            document.body.classList.remove("ceo-modal-open");
            btnRef.current?.focus();
          }}
        >
          <div className="ceo-modal__head">
            <h2 className="ceo-modal__title" id="ceo-modal-title">
              {title}
            </h2>
            <button
              type="button"
              className="ceo-modal__close"
              aria-label="Close"
              onClick={() => dialogRef.current?.close()}
            >
              ×
            </button>
          </div>
          <div ref={bodyRef} className="ceo-modal__body ceo-story">
            {list(false)}
          </div>
        </dialog>
      )}
    </>
  );
}
