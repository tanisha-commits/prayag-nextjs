import { HONEYPOT_FIELD } from "@/lib/enquiry/forms";
import { cn } from "@/lib/utils";
import type { EnquiryState } from "./use-enquiry-form";

/** Olivero (the source's base theme) status icons — core/themes/olivero/images/{error,status}.svg. */
function ErrorIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" aria-hidden="true" className="fill-[#e33f1e] align-top">
      <path d="M0,16.2C0.5,23.1,5.2,29,12,30.6c6.3,1.5,13.1-1.2,16.6-6.7c3.4-5.3,3.2-12.3-0.5-17.4C24.2,1,16.9-1.4,10.6,0.8C4.2,3-0.5,9.4,0,16.2z M3.9,14.5c0.4-4.1,3-7.8,6.7-9.5c1.9-0.9,3.9-1.2,5.9-1c1,0.1,2,0.3,3,0.7c0.4,0.1,2.2,0.7,2.3,1.2C22,6,19.5,8.1,19.3,8.3c-1.8,1.8-3.6,3.6-5.4,5.5c-1.8,1.8-3.6,3.6-5.5,5.4c-0.6,0.6-1.2,1.2-1.8,1.8c-0.1,0.1-0.6,0.8-0.8,0.8c-0.6,0-1.5-3.2-1.6-3.7C3.9,16.9,3.8,15.7,3.9,14.5z M25.3,9.1c0.7,0.7,1.2,2.2,1.4,3.1c0.3,1.2,0.5,2.4,0.4,3.7c-0.1,2.8-1.2,5.4-3.1,7.5c-3.8,4.1-10.2,4.9-14.9,1.8C10.7,23.6,25.1,9,25.3,9.1z" />
    </svg>
  );
}

function StatusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" className="fill-[#3fa21c] align-top">
      <path d="M26.8,12.6c0,0.4-0.1,0.7-0.4,0.9L15.1,24.9c-0.2,0.2-0.6,0.4-1,0.4c-0.3,0-0.7-0.1-0.9-0.4l-7.5-7.5c-0.2-0.2-0.4-0.6-0.4-0.9c0-0.4,0.1-0.7,0.4-1l1.9-1.9c0.2-0.2,0.6-0.4,0.9-0.4c0.4,0,0.7,0.1,0.9,0.4l4.7,4.7l8.5-8.5c0.2-0.2,0.6-0.4,0.9-0.4c0.4,0,0.7,0.1,0.9,0.4l1.9,1.9C26.6,11.9,26.8,12.3,26.8,12.6z M32,16c0-8.8-7.2-16-16-16C7.2,0,0,7.2,0,16c0,8.8,7.2,16,16,16C24.8,32,32,24.8,32,16z" />
    </svg>
  );
}

/**
 * Drupal/Olivero status-messages block (`.messages--status` / `.messages--error`), shown for
 * the submission outcome. Rendered empty (and taking no space) while idle/submitting so the
 * page layout matches the source until something happens.
 */
export function FormMessages({
  state,
  messageRef,
  className,
}: {
  state: EnquiryState;
  messageRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const { phase } = state;
  const visible = phase === "success" || phase === "invalid" || phase === "pending" || phase === "error";
  const isError = phase !== "success";
  const items = phase === "invalid" ? Object.values(state.errors) : [state.message];
  return (
    <div ref={messageRef} tabIndex={-1} aria-live="polite" className={cn("outline-none", className)}>
      {visible ? (
        <div
          className="my-[18px] min-h-[68px] bg-[#0d1214] px-[27px] py-[18px] text-white outline outline-1 outline-transparent"
          // Drupal's Olivero markup uses role="contentinfo" (a page-footer landmark); a labelled
          // group inside the single polite live region announces the message once.
          role="group"
          aria-label={isError ? "Error message" : "Status message"}
          data-enquiry-state={phase}
        >
          <div className="flex">
            <div className="mr-[18px] shrink-0">{isError ? <ErrorIcon /> : <StatusIcon />}</div>
            <div className="flex-1 pt-[3px] text-[18px] leading-[28.8px]">
              {items.length > 1 ? (
                <ul className="m-0 list-none p-0">
                  {items.map((item) => (
                    <li key={item} className="[&+li]:mt-[9px]">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                items[0]
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Webform inline error (`strong.form-item--error-message`, Olivero styling). */
export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <strong
      id={id}
      className="my-[9px] block bg-[url(/sites/prayag/icons/form-error.svg)] bg-[length:18px_18px] bg-left-top bg-no-repeat pl-[27px] font-bold text-[#e33f1e]"
    >
      {message}
    </strong>
  );
}

/** Off-screen honeypot; never visible, not focusable, ignored by assistive tech. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={`edit-${HONEYPOT_FIELD}`}>Leave this field blank</label>
      <input id={`edit-${HONEYPOT_FIELD}`} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}

/** Small spinner shown beside the submit button while a submission is in flight. */
export function SubmittingIndicator({ active, className }: { active: boolean; className?: string }) {
  if (!active) return null;
  return (
    <span role="status" className={cn("inline-flex items-center gap-2 self-center text-[16px]", className)}>
      <span aria-hidden="true" className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent" />
      <span className="sr-only">Submitting…</span>
    </span>
  );
}
