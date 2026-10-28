"use client";

import { useCallback, useRef, useState } from "react";
import type { EnquiryResult, FieldDef, FieldErrors, FormId } from "@/lib/enquiry/forms";

export type EnquiryPhase = "idle" | "submitting" | "success" | "invalid" | "pending" | "error";

export interface EnquiryState {
  phase: EnquiryPhase;
  message: string;
  errors: FieldErrors;
}

const IDLE: EnquiryState = { phase: "idle", message: "", errors: {} };
const NETWORK_ERROR =
  "Sorry, your enquiry could not be sent right now. Please check your connection and try again.";

/**
 * Native-validation hooks equivalent to Drupal Webform's `webformRequiredError` behaviour
 * (modules/contrib/webform/js/webform.form.js): on `invalid` show the field's custom
 * pattern/required message in the browser bubble; clear it again on `input`/`change`.
 */
export function webformValidityProps(field: FieldDef) {
  if (!field.requiredError && !field.patternError) return {};
  const onInvalid = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.setCustomValidity("");
    if (el.validity.patternMismatch && field.patternError) el.setCustomValidity(field.patternError);
    else if (el.validity.valueMissing && field.requiredError) el.setCustomValidity(field.requiredError);
  };
  const reset = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    e.currentTarget.setCustomValidity("");
  };
  return { onInvalid, onInput: reset, onChange: reset };
}

/**
 * Submission state machine for the enquiry forms. The form only reaches `onSubmit` after the
 * browser's constraint validation passed (no `noValidate`, like the source). The server
 * re-validates and forwards; success is shown only for a 2xx forwarding result.
 */
export function useEnquiryForm(formId: FormId) {
  const [state, setState] = useState<EnquiryState>(IDLE);
  const messageRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const clearFieldError = useCallback((name: string) => {
    setState((s) => {
      if (!s.errors[name]) return s;
      const errors = { ...s.errors };
      delete errors[name];
      return { ...s, errors };
    });
  }, []);

  const submit = useCallback(
    async (form: HTMLFormElement, overrides: Record<string, string> = {}) => {
      if (busy.current) return;
      busy.current = true;
      setState({ phase: "submitting", message: "", errors: {} });

      const payload: Record<string, string> = {};
      new FormData(form).forEach((value, key) => {
        if (typeof value === "string") payload[key] = value;
      });
      Object.assign(payload, overrides);
      if (formId === "contact") {
        const product = new URLSearchParams(window.location.search).get("product");
        if (product) payload.product = product;
      }

      let next: EnquiryState;
      try {
        const res = await fetch(`/api/enquiry/${formId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json().catch(() => null)) as EnquiryResult | null;
        if (res.ok && data?.status === "success") {
          next = { phase: "success", message: data.message, errors: {} };
          form.reset();
        } else if (data?.status === "invalid") {
          next = { phase: "invalid", message: data.message, errors: data.errors };
        } else if (data?.status === "pending") {
          next = { phase: "pending", message: data.message, errors: {} };
        } else {
          next = { phase: "error", message: data?.message || NETWORK_ERROR, errors: {} };
        }
      } catch {
        next = { phase: "error", message: NETWORK_ERROR, errors: {} };
      }
      busy.current = false;
      setState(next);
      requestAnimationFrame(() => {
        messageRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
        messageRef.current?.focus({ preventScroll: true });
      });
      return next;
    },
    [formId],
  );

  return { state, submit, clearFieldError, messageRef, submitting: state.phase === "submitting" };
}
