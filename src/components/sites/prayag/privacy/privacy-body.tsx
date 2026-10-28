import { privacyPolicyHtml } from "@/content/prayag/privacy/policy";

import "./privacy.css";

/** Source `section.privacy_policy`: the CMS body rendered verbatim (static, trusted source HTML). */
export function PrivacyBody() {
  return (
    <section className="privacy_policy">
      {/* Source `.container-fluid { overflow: hidden }` clips overflowing card text. */}
      <div className="prayag-container overflow-hidden">
        <div className="privacy-body" dangerouslySetInnerHTML={{ __html: privacyPolicyHtml }} />
      </div>
    </section>
  );
}
