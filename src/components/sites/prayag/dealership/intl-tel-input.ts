/**
 * intl-tel-input v17.0.12 (MIT) — the exact version the source page loads from cdnjs. Self-hosted
 * under public/sites/prayag/vendor/ so no npm dependency or third-party runtime request is needed.
 */
export const ITI_BASE = "/sites/prayag/vendor/intl-tel-input-17.0.12";

export interface ItiInstance {
  isValidNumber(): boolean | null;
  getNumber(): string;
  setNumber(n: string): void;
  destroy(): void;
}

export interface ItiOptions {
  initialCountry?: string;
  geoIpLookup?: (success: (countryCode: string) => void, failure?: () => void) => void;
  utilsScript?: string;
}

declare global {
  interface Window {
    intlTelInput?: (input: HTMLInputElement, options?: ItiOptions) => ItiInstance;
  }
}
