"use client";

import Script from "next/script";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DEALERSHIP_FIELDS, type FieldDef } from "@/lib/enquiry/forms";
import { cn } from "@/lib/utils";
import { FieldError, FormMessages, Honeypot, SubmittingIndicator } from "../forms/form-feedback";
import { useEnquiryForm, webformValidityProps } from "../forms/use-enquiry-form";
import { ITI_BASE, type ItiInstance } from "./intl-tel-input";

/** Source `.dealership_form .form-item-*` widths (all 100% at <= 768px). */
const THIRDS = new Set(["name", "e_mail", "phone_number", "dealership_requirements", "pincode", "company_name"]);

const CONTROL =
  "block h-[54px] w-full appearance-none rounded-[4px] border border-black/10 bg-transparent px-[15px] py-[10px] text-[16px] placeholder:text-[#555] placeholder:opacity-100";
const INPUT_FOCUS = "focus:outline-[6px] focus:outline-double focus:outline-[#2494db] focus:-outline-offset-1";
const ERROR = "border-2 border-[#e33f1e]";

export function DealershipForm() {
  const { state, submit, clearFieldError, messageRef, submitting } = useEnquiryForm("dealership");
  const phoneInput = useRef<HTMLInputElement>(null);
  const iti = useRef<ItiInstance | null>(null);
  const [itiLoaded, setItiLoaded] = useState(false);

  const initIti = useCallback(() => {
    if (iti.current || !phoneInput.current || !window.intlTelInput) return;
    iti.current = window.intlTelInput(phoneInput.current, {
      // Source: initialCountry "auto" with an ipinfo.io lookup that the live site's own CSP
      // blocks, so no country is ever preselected (blank flag). Reproduced without the
      // third-party request: the lookup simply never resolves.
      initialCountry: "auto",
      geoIpLookup: () => {},
      utilsScript: `${ITI_BASE}/js/utils.js`,
    });
  }, []);

  useEffect(() => {
    if (itiLoaded) initIti();
  }, [itiLoaded, initIti]);

  // Layout-effect cleanup runs before React detaches the input, so iti can unwrap it first.
  useLayoutEffect(
    () => () => {
      iti.current?.destroy();
      iti.current = null;
    },
    [],
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    const overrides: Record<string, string> = {};
    // Source submit handler: intl-tel-input validation with a blocking alert, then the full
    // international number replaces the typed value.
    if (iti.current && phoneInput.current) {
      if (!iti.current.isValidNumber()) {
        window.alert("Please enter a valid phone number with the country code.");
        phoneInput.current.focus();
        return;
      }
      overrides.phone_number = iti.current.getNumber();
    }
    void submit(e.currentTarget, overrides).then((result) => {
      if (result?.phase === "success") iti.current?.setNumber("");
    });
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
            CONTROL,
            "leading-6 text-[#555] transition-[border-color,box-shadow] duration-150 ease-in-out focus:shadow-[0_0_0_4px_rgba(13,110,253,0.25)] focus:outline-none",
            err && ERROR,
          )}
        >
          <option value="">{field.emptyOption}</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value} className="text-black">
              {o.label}
            </option>
          ))}
        </select>
      );
    }
    if (field.type === "textarea") {
      return (
        <textarea
          {...common}
          rows={field.rows}
          cols={60}
          placeholder={field.placeholder}
          className={cn(CONTROL, INPUT_FOCUS, "h-[150px] resize-none leading-[28.8px] text-[#0d1214]", err && ERROR)}
        />
      );
    }
    const input = (
      <input
        {...common}
        ref={field.name === "phone_number" ? phoneInput : undefined}
        type={field.type}
        placeholder={field.placeholder}
        pattern={field.serverOnlyPattern ? undefined : field.pattern}
        maxLength={field.maxLength}
        size={field.size}
        step={field.type === "number" ? "any" : undefined}
        className={cn(CONTROL, INPUT_FOCUS, "leading-[28.8px] text-black", field.type === "text" && "mt-1", err && ERROR)}
      />
    );
    if (field.name === "phone_number") {
      return (
        <div className="[&_.iti]:w-full">
          {input}
        </div>
      );
    }
    return input;
  };

  return (
    <div className="mx-0 w-full px-[15px] py-[10px] min-[768px]:mx-auto min-[768px]:w-[90%] min-[768px]:p-0">
      {/* React 19 hoists precedence stylesheets into <head> during SSR. */}
      <link rel="stylesheet" href={`${ITI_BASE}/css/intlTelInput.min.css`} precedence="default" />
      <Script src={`${ITI_BASE}/js/intlTelInput.min.js`} strategy="afterInteractive" onReady={() => setItiLoaded(true)} />
      <FormMessages state={state} messageRef={messageRef} />
      <form
        className="relative -mx-[15px] flex flex-wrap"
        action="/api/enquiry/dealership"
        method="post"
        id="webform-submission-dealership-enquiry-node-67-add-form"
        acceptCharset="UTF-8"
        onSubmit={onSubmit}
        aria-busy={submitting || undefined}
      >
        {DEALERSHIP_FIELDS.map((field) => (
          <div
            key={field.name}
            className={cn(
              "mb-5 w-full px-[15px]",
              field.name === "enquiry_type" ? "" : THIRDS.has(field.name) ? "md:w-1/3" : "md:w-1/2",
            )}
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
            value="Submit"
            disabled={submitting}
            className="my-[9px] mr-[18px] block h-[54px] cursor-pointer rounded-[80px] border border-[#0f6292] bg-[#0f6292] px-12 py-3 [font-family:metropolis,sans-serif] text-[18px] leading-[18px] font-bold text-white hover:border-2 disabled:cursor-wait disabled:opacity-70"
          />
          <SubmittingIndicator active={submitting} className="text-[#0f6292]" />
        </div>
      </form>
    </div>
  );
}
