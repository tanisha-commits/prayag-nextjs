// Inline SVGs copied from the Prayag homepage markup.
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function SearchIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14.129 12.9735C15.3055 11.5018 15.8737 9.63554 15.717 7.7579C15.5603 5.88026 14.6905 4.13399 13.2862 2.8777C11.8821 1.62141 10.0502 0.950558 8.16662 1.00284C6.28324 1.05511 4.49119 1.82667 3.15892 3.15889C1.82667 4.4912 1.05513 6.28301 1.00285 8.16653C0.950512 10.0499 1.62142 11.8818 2.87773 13.2861C4.13411 14.6903 5.88032 15.5601 7.75799 15.7168C9.63565 15.8735 11.502 15.3053 12.9737 14.1289L17.6155 18.7707H17.6155C17.823 18.9711 18.1208 19.0472 18.399 18.9709C18.6772 18.8946 18.8946 18.6773 18.9709 18.3991C19.0472 18.1209 18.9711 17.8231 18.7707 17.6155L14.129 12.9735ZM8.39001 14.1082C6.87337 14.1082 5.41878 13.5058 4.3463 12.4334C3.27382 11.361 2.6714 9.90642 2.6714 8.3897C2.6714 6.87298 3.2739 5.41852 4.3463 4.34604C5.4187 3.27357 6.87327 2.67117 8.39001 2.67117C9.90674 2.67117 11.3612 3.27366 12.4337 4.34604C13.5062 5.41843 14.1086 6.87298 14.1086 8.3897C14.1069 9.90582 13.5038 11.3593 12.4318 12.4314C11.3597 13.5035 9.90625 14.1066 8.39001 14.1082Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.2"
      />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}

export function SparkleIcon(props: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M11 18h2" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3.40958 0C1.53094 0 0.0013755 1.52927 0 3.40938C0 5.2895 1.52956 6.81906 3.40958 6.81906C5.28891 6.81906 6.81768 5.2895 6.81768 3.40938C6.81768 1.52946 5.28881 0 3.40958 0Z" />
      <path d="M5.96935 8.18701H0.851103C0.607639 8.18701 0.410156 8.3844 0.410156 8.62806V25.1022C0.410156 25.3457 0.607639 25.5431 0.851103 25.5431H5.96925C6.21282 25.5431 6.4103 25.3456 6.4103 25.1022V8.62806C6.4104 8.3843 6.21291 8.18701 5.96935 8.18701Z" />
      <path d="M19.0535 7.99487C17.1804 7.99487 15.5344 8.56522 14.53 9.49525V8.62986C14.53 8.3862 14.3326 8.18882 14.089 8.18882H9.17933C8.93576 8.18882 8.73828 8.3862 8.73828 8.62986V25.104C8.73828 25.3475 8.93576 25.5449 9.17933 25.5449H14.2927C14.5362 25.5449 14.7337 25.3474 14.7337 25.104V16.9534C14.7337 14.6149 15.1638 13.1654 17.3105 13.1654C19.4255 13.1679 19.5837 14.7223 19.5837 17.0931V25.104C19.5837 25.3475 19.7812 25.5449 20.0249 25.5449H25.1406C25.384 25.5449 25.5815 25.3474 25.5815 25.104V16.0672C25.5814 12.3088 24.8394 7.99487 19.0535 7.99487Z" />
    </svg>
  );
}

export function SoundOffIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

export function SoundOnIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}

/** The arrow used in every `.prayag-btn`. */
export function ArrowIcon(props: IconProps) {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true" {...props}>
      <path
        d="M21.2308 5.99866C21.2211 5.78469 21.1301 5.53538 20.9771 5.37908L15.9807 0.279282C15.6418 -0.0128267 14.993 -0.133765 14.6154 0.204859C14.2436 0.537901 14.2533 1.18352 14.6251 1.51656L18.1381 5.09813H0.937304C0.420215 5.09813 0 5.50188 0 5.99864C0 6.49542 0.420245 6.89914 0.937304 6.89914H18.1381L14.6251 10.4807C14.3055 10.7877 14.2455 11.4557 14.6154 11.7924C14.9834 12.1292 15.6573 12.0213 15.9807 11.718L20.9771 6.61819C21.1475 6.4433 21.2308 6.23868 21.2308 5.99866Z"
        fill="currentColor"
      />
    </svg>
  );
}
