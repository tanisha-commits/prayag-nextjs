import { type FieldDef, type FieldErrors, FORM_FIELDS, type FormId } from "./forms";

/**
 * Server-side validation equivalent to what Drupal + Webform enforce for these forms
 * (messages follow Drupal core / Webform wording). The first error per field wins, like
 * Drupal's FormState::setError().
 */

// Drupal's email validator is RFC-based; this is the HTML spec's "valid e-mail address" rule,
// which is what the browser enforces for type=email on the source page.
const EMAIL_SYNTAX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/** Hard cap for fields without a source maxlength (textareas, number). */
const DEFAULT_MAX = 5000;

function patternMatches(pattern: string, value: string): boolean {
  // Webform wraps patterns as {^(?:pattern)$}u — same anchoring as the HTML pattern attribute.
  return new RegExp(`^(?:${pattern})$`, "u").test(value);
}

function validateField(field: FieldDef, raw: string): string | null {
  const value = raw;
  if (value.trim() === "") {
    if (!field.required) return null;
    return field.requiredError ?? `${field.label} field is required.`;
  }
  const max = field.maxLength ?? DEFAULT_MAX;
  if (value.length > max) {
    return `${field.label} cannot be longer than ${max} characters but is currently ${value.length} characters long.`;
  }
  if (field.type === "select") {
    if (!field.options?.some((o) => o.value === value)) {
      return "An illegal choice has been detected. Please contact the site administrator.";
    }
    return null;
  }
  if (field.type === "email" && !EMAIL_SYNTAX.test(value)) {
    return `The email address ${value} is not valid.`;
  }
  if (field.type === "number" && !/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(value.trim())) {
    return `${field.label} must be a number.`;
  }
  if (field.pattern && !patternMatches(field.pattern, value)) {
    return field.patternError ?? `${field.label} field is not in the right format.`;
  }
  return null;
}

export interface ValidationOutcome {
  values: Record<string, string>;
  errors: FieldErrors;
}

/** Validates `input` against the form's field list; unknown keys are dropped. */
export function validateEnquiry(formId: FormId, input: Record<string, unknown>): ValidationOutcome {
  const values: Record<string, string> = {};
  const errors: FieldErrors = {};
  for (const field of FORM_FIELDS[formId]) {
    const rawValue = input[field.name];
    const value = typeof rawValue === "string" ? rawValue : rawValue == null ? "" : String(rawValue);
    // Drupal textfields drop line breaks; textareas keep them.
    const normalised = field.type === "textarea" ? value.replace(/\r\n?/g, "\n") : value.replace(/[\r\n]+/g, "");
    values[field.name] = normalised;
    const error = validateField(field, normalised);
    if (error) errors[field.name] = error;
  }
  return { values, errors };
}
