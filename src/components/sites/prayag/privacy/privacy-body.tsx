import { getContent } from "@/lib/content";

import { storedHtml } from "@/lib/stored-html";
import "./privacy.css";

/** Source `section.privacy_policy`: the body from editable content (pages/privacy-policy; HTML sanitized on save). */
export function PrivacyBody() {
  const { html: privacyPolicyHtml } = getContent("pages/privacy-policy");
  return (
    <section className="privacy_policy">
      {/* Source `.container-fluid { overflow: hidden }` clips overflowing card text. */}
      <div className="prayag-container overflow-hidden">
        <div className="privacy-body" dangerouslySetInnerHTML={{ __html: storedHtml(privacyPolicyHtml) }} />
      </div>
    </section>
  );
}
