import { privacyPolicyHtml } from "@/content/prayag/privacy/policy";

import { storedHtml } from "@/lib/stored-html";
import "./privacy.css";

export function PrivacyBody() {
  return (
    <section className="privacy_policy">
      <div className="prayag-container overflow-hidden">
        <div className="privacy-body" dangerouslySetInnerHTML={{ __html: storedHtml(privacyPolicyHtml) }} />
      </div>
    </section>
  );
}
