import { contact, footerColumns, pageLinks, socialIcons, socialLinks } from "./data";
import { LinkedInIcon } from "./icons";

const linkClass =
  "mb-1.5 inline-block text-[15px] leading-[25px] font-light text-white transition-all duration-200 hover:ml-[7px] md:mb-2.5 md:text-[17px] md:leading-[28.8px]";

export function SiteFooter() {
  return (
    <footer className="bg-[#171717] text-[18px] leading-[1.6]">
      <div className="prayag-container">
        <div className="-mx-3 flex flex-wrap">
          <div className="mb-[30px] w-full border-b border-[#4e4e4e] px-3 pt-[50px] pb-5 lg:mb-[50px] lg:pt-20">
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 md:w-3/4">
                <h3 className="mb-[18px] text-[20px] leading-[30px] font-medium text-white lg:mb-2 lg:text-[22px] lg:leading-[1.4]">
                  Folllow Us On
                </h3>
              </div>
              <div className="w-full px-3 md:w-1/4">
                <ul className="flex gap-5 md:justify-between md:gap-0">
                  {(["facebook", "twitter", "youtube", "instagram"] as const).map((key) => (
                    <li key={key}>
                      <a href={socialLinks[key]} aria-label={`share to ${key}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- 30px source icon */}
                        <img src={socialIcons[key]} alt="" width={30} height={30} loading="lazy" className="w-[30px]" />
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href={socialLinks.linkedin} aria-label="share to linkedin" className="text-white">
                      <LinkedInIcon />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="mb-[30px] w-full px-3 md:mb-0 md:w-1/4">
              <FooterHeading>{column.title}</FooterHeading>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank" } : {})}
                      className={linkClass}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="w-full px-3 md:w-1/4">
            <FooterHeading>Get In Touch</FooterHeading>
            <ul>
              <li className="mb-3.5 text-[14px] leading-[28.8px] font-light text-white md:mb-[30px] md:text-[17px]">
                {contact.address}
              </li>
              {contact.phones.map((phone) => (
                <li key={phone.label}>
                  <a href={phone.href} className={linkClass}>
                    {phone.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-[#171717] py-[17px] md:mt-6">
        <div className="prayag-container">
          <p className="mb-0 flex w-full flex-col items-start justify-between gap-2 text-[12px] leading-[25px] text-white sm:flex-row sm:items-center sm:gap-0 md:text-[16px] md:leading-6 xl:leading-7">
            <span>© Prayag Polymers Limited. 2026. All Rights Reserved</span>
            <span>
              Developed by{" "}
              <a
                href={pageLinks.developer}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white no-underline hover:underline"
              >
                AbacusDesk
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-[11px] text-[20px] leading-[1.4] font-medium text-white md:text-[20px] lg:mb-5 lg:text-[24px]">
      {children}
    </h3>
  );
}
