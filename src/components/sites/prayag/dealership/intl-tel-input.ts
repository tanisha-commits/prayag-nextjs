import { BASE_PATH } from "@/lib/base-path";

export const ITI_BASE = `${BASE_PATH}/sites/prayag/vendor/intl-tel-input-17.0.12`;

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
