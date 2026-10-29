"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";
import "./read-more-modal.css";

// Bootstrap's .modal.fade timing: dialog slides for 300ms (backdrop fades in 150ms).
const TRANSITION_MS = 300;

type ModalApi = {
  open: () => void;
  close: () => void;
  shown: boolean;
  dialogRef: RefObject<HTMLDialogElement | null>;
};
const ModalContext = createContext<ModalApi | null>(null);

function unlockScroll() {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

/**
 * Source `#prayagReadMoreModal`: a Bootstrap 5 modal opened by the "Read More" button
 * (`data-bs-toggle="modal"`). Rebuilt on a native <dialog> that keeps the Bootstrap markup and
 * classes: showModal() gives the focus trap and top layer, Esc / backdrop click / both close
 * buttons close it with Bootstrap's fade + slide, the page scroll is locked like `body.modal-open`,
 * and focus returns to the Read More button. The provider wraps the section and the dialog so the
 * dialog can stay outside the section, as on the source (section text styles must not reach it).
 */
export function ReadMoreModalProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const [shown, setShown] = useState(false);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      unlockScroll();
    },
    [],
  );

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    // body.modal-open: hide the page scrollbar and keep the layout width.
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    dialog.showModal();
    // Like Bootstrap, focus the modal itself (tabindex=-1) rather than its first button.
    dialog.focus();
    requestAnimationFrame(() => setShown(true));
  };

  const close = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open || timer.current !== undefined) return;
    setShown(false);
    timer.current = window.setTimeout(() => {
      timer.current = undefined;
      dialog.close();
      unlockScroll();
      opener.current?.focus();
    }, TRANSITION_MS);
  };

  return <ModalContext.Provider value={{ open, close, shown, dialogRef }}>{children}</ModalContext.Provider>;
}

export function ReadMoreButton({ children }: { children: ReactNode }) {
  const modal = useContext(ModalContext);
  return (
    <button type="button" className="btn prayag-read-more-btn" aria-haspopup="dialog" onClick={modal?.open}>
      {children}
    </button>
  );
}

export function ReadMoreDialog({ title, children }: { title: string; children: ReactNode }) {
  const modal = useContext(ModalContext);
  const close = () => modal?.close();

  // Bootstrap closes on clicks outside .modal-content; .modal-dialog has pointer-events: none,
  // so those clicks land on the <dialog> itself.
  const onClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <dialog
      ref={modal?.dialogRef}
      className={cn("modal fade", modal?.shown && "show")}
      id="prayagReadMoreModal"
      tabIndex={-1}
      aria-labelledby="prayagReadMoreModalLabel"
      onClick={onClick}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="prayagReadMoreModalLabel">
              {title}
            </h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={close} />
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn prayag-modal-close-btn" onClick={close}>
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
