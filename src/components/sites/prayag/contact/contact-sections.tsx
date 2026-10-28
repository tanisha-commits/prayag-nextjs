import { cn } from "@/lib/utils";
import styles from "./contact.module.css";

/** Factory icon used for every manufacturing unit on the source (inline SVG, 32x32). */
function FactoryIcon() {
  return (
    <svg width="32px" height="32px" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="mb-3 block">
      <path d="m206.26 876.56h75c18.094 0 32.812-14.719 32.812-32.812v-75c0-18.094-14.719-32.812-32.812-32.812h-75c-18.094 0-32.812 14.719-32.812 32.812v75c0 18.094 14.719 32.812 32.812 32.812zm-4.6875-107.81c0-2.5781 2.1094-4.6875 4.6875-4.6875h75c2.5781 0 4.6875 2.1094 4.6875 4.6875v75c0 2.5781-2.1094 4.6875-4.6875 4.6875h-75c-2.5781 0-4.6875-2.1094-4.6875-4.6875zm885.94-239.06h-173.44v-93.703c0-10.031-4.5-19.406-12.328-25.641-7.875-6.2812-18-8.5781-27.75-6.3281l-60.328 13.734-21.469-343.6c-0.46875-7.4062-6.6094-13.172-14.062-13.172h-187.5c-7.4531 0-13.547 5.7656-14.016 13.172l-25.219 403.22-126.05 28.641-26.906-431.86c-0.46875-7.4062-6.6094-13.172-14.062-13.172h-187.5c-7.4531 0-13.547 5.7656-14.062 13.172l-30.844 493.97-65.484 14.906c-15.047 3.4219-25.547 16.594-25.547 32.016v472.55c0 28.406 23.109 51.562 51.562 51.562h975c28.453 0 51.562-23.109 51.562-51.562v-506.26c0-28.453-23.109-51.562-51.562-51.562zm-173.44 239.06c0-2.5781 2.1094-4.6875 4.6875-4.6875h75c2.5781 0 4.6875 2.1094 4.6875 4.6875v75c0 2.5781-2.1094 4.6875-4.6875 4.6875h-75c-2.5781 0-4.6875-2.1094-4.6875-4.6875zm-187.5 257.81h159.37v84.375h-159.37zm38.344-937.5 2.9062 46.875h-166.92l2.9062-46.875zm-165.74 75h170.44l16.266 259.97-205.87 46.781zm-228-75 2.9062 46.875h-166.92l2.9062-46.875zm-165.74 75h170.44l21.703 348.24-216.94 49.312 24.844-397.5zm-112.69 446.34 787.5-178.97c0.375-0.09375 0.75-0.14063 1.0781-0.14063 1.3594 0 2.3438 0.60938 2.9062 1.0312 0.65625 0.51563 1.7812 1.6875 1.7812 3.6562v562.45h-159.37v-267.19c0-18.094-14.719-32.812-32.812-32.812h-262.5c-18.094 0-32.812 14.719-32.812 32.812v267.19h-309.42v-383.48c0-2.2031 1.5-4.0781 3.6562-4.5469zm-3.6562 477.1v-60.938h309.37v84.375h-285.94c-12.938 0-23.438-10.5-23.438-23.438zm337.5 23.438v-379.69c0-2.5781 2.1094-4.6875 4.6875-4.6875h262.5c2.5781 0 4.6875 2.1094 4.6875 4.6875v379.69zm684.37-23.438c0 12.938-10.5 23.438-23.438 23.438h-173.44v-234.84c1.5469 0.23438 3.0938 0.46875 4.6875 0.46875h75c18.094 0 32.812-14.719 32.812-32.812v-75c0-18.094-14.719-32.812-32.812-32.812h-75c-1.5938 0-3.1406 0.23438-4.6875 0.46875v-178.6h173.44c12.938 0 23.438 10.5 23.438 23.438z" />
    </svg>
  );
}

/** Manufacturing units exactly as listed on the source (including its stray "- 722146" on Unit-V). */
const UNITS = [
  { label: "Unit-I", address: "A-1129, Phase-III, RIICO Industrial Area, Bhiwadi Alwar, Rajasthan - 301019" },
  { label: "Unit-II", address: "E-167, E-167A, E-168, E-263, E-264 RIICO Industrial Area, Kaharani, Bhiwadi Extn., Rajasthan - 301019" },
  { label: "Unit-III", address: "UNIT III: Plot No. A-166, RIICO Industrial Area, Kaharani, Bhiwadi 301019" },
  { label: "Unit-IV", address: "DAG-542,546,551,552,555,556,794, Village & Mouza Patakola, Jagadalla Dist. Bankura West Bengal - 722146" },
  { label: "Unit-V", address: "F-61, Industrial Area, Ram Nagar, Chandauli, Varanasi, Uttar Pradesh - 221110 - 722146" },
];

/**
 * Corporate-office numbers as shown on the source contact page. They differ from the footer
 * ("1800 257 0304" / "011 41246500") — that is the source's own data.
 */
const NUMBERS = [
  { label: "Toll Free No.:", text: "+1 (800) 257 0304", href: "tel:+18002570304" },
  { label: "Enquiry No.:", text: "92898 74228", href: "tel:9289874228" },
];

/** Source `section.contact-section`: intro, corporate office and manufacturing units. */
export function ContactInfoSection() {
  return (
    <section className={cn("relative overflow-hidden bg-white py-[60px] text-black md:py-24", styles.fadeIn)}>
      <div className="prayag-container">
        <div className="-mx-3 flex flex-wrap">
          <div className="w-full px-3 min-[992px]:w-1/2">
            <div className="w-[81%]">
              <h2 className="m-0 mb-6 p-0 text-[24px] leading-8 font-medium text-black min-[768px]:text-[38px] min-[768px]:leading-[46px] min-[1400px]:text-[52px] min-[1400px]:leading-[62px]">
                Contact our team
              </h2>
              <p className="m-0 mb-3 text-[1.1rem] leading-[25px] font-medium text-black min-[577px]:text-[1.2rem] min-[768px]:leading-6 min-[1400px]:leading-7">
                Let&apos;s help you get started.
              </p>
              <p className="m-0 mb-4 text-[18px] leading-7 text-black">
                Please complete this form to give our team more information about your business needs.
              </p>
            </div>
          </div>
          <div className="w-full px-3 min-[992px]:w-1/2">
            <div className="mt-10 ml-[30px] md:mt-0">
              <h3 className="m-0 mb-3 text-[28px] leading-[38px] font-medium text-black">Corporate office</h3>
              <div className="pb-12 transition-transform duration-300 ease-[ease] hover:translate-x-[5px]">
                <div className="text-[18px] leading-7 text-black">
                  2483-84, Prayag Infinity House, Nalwa Street,
                  <br /> Pahar Ganj, New Delhi - 110055
                </div>
                <div className="mt-6">
                  <div className="-mx-3 flex flex-wrap">
                    {NUMBERS.map((n) => (
                      <div key={n.label} className="flex w-full items-baseline gap-2 px-3">
                        <h5 className="m-0 text-[18px] leading-[25.2px] font-medium text-black">{n.label}</h5>
                        <ul className="m-0 list-none p-0">
                          <li className="m-0 text-[16px] leading-[28.8px] text-black">
                            <a href={n.href} className="p-0 text-black underline transition-colors duration-300 hover:text-[#2980b9]">
                              {n.text}
                            </a>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="mt-4 mb-12 h-px border-0 bg-black opacity-25" />
        <div className="-mx-3 flex flex-wrap">
          <div className="w-full px-3">
            <h3 className="m-0 mb-6 text-[32px] leading-[42px] font-medium text-black">Manufacturing</h3>
          </div>
          <div className="grid w-full grid-cols-1 gap-y-3 px-3 md:grid-cols-2 md:gap-12">
            {UNITS.map((u) => (
              <div key={u.label} className="w-full bg-[#dddddd78] p-6 text-left">
                <FactoryIcon />
                <div className="mb-2 text-[18px] leading-[28.8px] font-medium text-black">{u.label}</div>
                <div className="text-[18px] leading-7 text-black">{u.address}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const BOXES = [
  { title: "Our Product", image: "/sites/prayag/files/2024-10/products-1-.webp", href: "https://prayagindia.com/products" },
  { title: "Become a Dealer", image: "/sites/prayag/files/2024-09/Banner_0.webp", href: "/dealership-enquiry" },
  { title: "FAQ", image: "/sites/prayag/files/2024-08/FAQS.webp", href: "https://prayagindia.com/latest-faqs" },
];

/** Source `section.contact_main_box`: three link cards (always three columns). */
export function ContactLinkBoxes() {
  return (
    <section className="py-[50px] min-[768px]:py-[60px]">
      <div className="prayag-container">
        <div className="-mx-3 flex flex-wrap">
          {BOXES.map((box) => (
            <div key={box.title} className="w-1/3 px-3">
              <div className="group">
                <a href={box.href} className="grid">
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element -- fixed 230px cover crop like the source */}
                    <img src={box.image} alt={box.title} loading="lazy" className="h-[230px] w-full object-cover" />
                  </div>
                  <div className="relative flex items-center gap-x-4 border-b border-[#dbdbdb] py-5 before:absolute before:bottom-0 before:block before:h-[2px] before:w-0 before:bg-black before:transition-all before:duration-300 before:content-[''] group-hover:before:w-full">
                    <h4 className="m-0 text-[23px] leading-[32.2px] font-semibold text-black">{box.title}</h4>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
