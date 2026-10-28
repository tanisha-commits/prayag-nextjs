"use client";

import { CONTACT_FIELDS, type FieldDef } from "@/lib/enquiry/forms";
import { cn } from "@/lib/utils";
import { FieldError, FormMessages, Honeypot, SubmittingIndicator } from "../forms/form-feedback";
import { useEnquiryForm, webformValidityProps } from "../forms/use-enquiry-form";

/** Fields rendered in `col-md-12` on the source; the rest are `col-md-6`. */
const FULL_WIDTH = new Set(["company_name", "address", "message"]);

// Bootstrap `.form-select` chevron, as served by the source theme.
const SELECT_ARROW = "bg-[url(/sites/prayag/icons/form-select-chevron.svg)]";

const FIELD_BASE = "w-full rounded-[3px] border border-[#ccc] bg-white px-[18px] leading-[28.8px] placeholder:text-[#7e96a7]";
const FIELD_FOCUS = "focus:outline-[6px] focus:outline-double focus:outline-[#2494db] focus:-outline-offset-1";
const ERROR = "border-2 border-[#e33f1e]";

/**
 * "Get in Touch" webform (`webform-submission-contact-node-4-add-form`). The per-type differences
 * (15.75px grey text + 4px top margin on text inputs, 18px elsewhere) are the source's computed
 * styles from overlapping theme rules, kept as-is.
 */
export function ContactForm() {
  const { state, submit, clearFieldError, messageRef, submitting } = useEnquiryForm("contact");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    void submit(e.currentTarget);
  };

  const renderControl = (field: FieldDef) => {
    const err = state.errors[field.name];
    const validity = webformValidityProps(field);
    const common = {
      id: field.id,
      name: field.name,
      required: field.required || undefined,
      "aria-required": field.required || undefined,
      "aria-invalid": err ? true : undefined,
      "aria-describedby": err ? `${field.id}-error` : undefined,
      onInvalid: validity.onInvalid,
      onInput: (ev: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        validity.onInput?.(ev);
        clearFieldError(field.name);
      },
      onChange: validity.onChange,
      "data-webform-required-error": field.requiredError,
      "data-webform-pattern-error": field.patternError,
    };
    if (field.type === "select") {
      return (
        <select
          {...common}
          defaultValue=""
          className={cn(
            "block h-[54px] w-full appearance-none rounded-[4px] border border-[#ced4da] bg-white py-[6px] pr-[54px] pl-[18px] text-[16px] leading-6 text-[#212529]",
            SELECT_ARROW,
            "bg-[length:16px_12px] bg-[position:right_12px_center] bg-no-repeat",
            "transition-[border-color,box-shadow] duration-150 ease-in-out focus:border-[#86b7fe] focus:shadow-[0_0_0_4px_rgba(13,110,253,0.25)] focus:outline-none",
            err && ERROR,
          )}
        >
          <option value="">{field.emptyOption}</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }
    if (field.type === "textarea") {
      return (
        <div>
          <textarea
            {...common}
            rows={field.rows}
            cols={60}
            placeholder={field.placeholder}
            className={cn(FIELD_BASE, FIELD_FOCUS, "block resize-y p-[18px] text-[18px] text-[#0d1214]", err && ERROR)}
          />
        </div>
      );
    }
    return (
      <input
        {...common}
        type={field.type}
        placeholder={field.placeholder}
        pattern={field.serverOnlyPattern ? undefined : field.pattern}
        maxLength={field.maxLength}
        size={field.size}
        step={field.type === "number" ? "any" : undefined}
        autoComplete={field.autoComplete}
        className={cn(
          FIELD_BASE,
          FIELD_FOCUS,
          "block h-[54px] focus:border-[#2494db]",
          field.type === "text" ? "mt-1 text-[15.75px] text-[#6c757d]" : "text-[18px] text-[#0d1214]",
          err && ERROR,
        )}
      />
    );
  };

  return (
    <div className="bg-black">
      <FormMessages state={state} messageRef={messageRef} />
      <div className="mb-[18px] min-[577px]:mb-9 min-[992px]:mb-[54px]">
        <form
          className="relative flex w-full flex-wrap min-[577px]:-mx-3"
          action="/api/enquiry/contact"
          method="post"
          id="webform-submission-contact-node-4-add-form"
          acceptCharset="UTF-8"
          onSubmit={onSubmit}
          aria-busy={submitting || undefined}
        >
          {CONTACT_FIELDS.map((field) => (
            <div
              key={field.name}
              className={cn("mb-[18px] w-full px-[10px] min-[577px]:px-3", !FULL_WIDTH.has(field.name) && "min-[768px]:w-1/2")}
            >
              <label htmlFor={field.id} className="sr-only">
                {field.label}
              </label>
              {renderControl(field)}
              <FieldError id={`${field.id}-error`} message={state.errors[field.name]} />
            </div>
          ))}
          <Honeypot />
          <div className="mb-[9px] flex w-full px-3">
            <input
              type="submit"
              value="Send message"
              disabled={submitting}
              className="my-[9px] mr-[18px] flex h-[54px] cursor-pointer items-center rounded-[3px] border border-[#ccc] bg-[#0d77b5] px-[27px] pt-px pb-0 [font-family:metropolis,sans-serif] text-[18px] leading-[18px] font-bold text-white hover:border-2 hover:border-[#0f6292] hover:bg-[#0f6292] disabled:cursor-wait disabled:opacity-70"
            />
            <SubmittingIndicator active={submitting} className="text-white" />
          </div>
        </form>
      </div>
    </div>
  );
}
