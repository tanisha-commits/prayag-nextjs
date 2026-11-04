import { getContent } from "@/lib/content";
import { SportingSpiritClient } from "./sporting-spirit-client";

/** Sponsorship logos carousel; content from home/sporting. */
export function SportingSpirit() {
  const { heading, sponsors } = getContent("home/sporting");
  return sponsors.length ? <SportingSpiritClient heading={heading} sponsors={sponsors} /> : null;
}
