import Link from "next/link";
import { withBasePath } from "@/lib/base-path";

export type FaqPart = string | { text: string; href: string };

export type Faq = { question: string; answer: FaqPart[] };

export function FaqSection({ faqs, split = 8 }: { faqs: Faq[]; split?: number }) {
  return (
    <section className="faq_main">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="faq_sing_pro">
              <h2>Faq&apos;s</h2>
              <div className="row">
                {[faqs.slice(0, split), faqs.slice(split)].map((column, c) => (
                  <div key={c} className="col-md-6 col-6">
                    {column.map((faq) => (
                      <div key={faq.question} className="faq_box">
                        <h3>{faq.question}</h3>
                        <p />
                        <p className="MsoNormal">
                          <span lang="EN-IN">
                            {faq.answer.map((part, i) =>
                              typeof part === "string" ? (
                                part
                              ) : part.href.startsWith("/") ? (
                                <Link key={i} href={part.href}>
                                  {part.text}
                                </Link>
                              ) : (
                                <a key={i} href={withBasePath(part.href)}>
                                  {part.text}
                                </a>
                              ),
                            )}
                          </span>
                        </p>
                        <p />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
