import { blurPlaceholder } from "@/lib/placeholder";
import { heroSlides } from "./data";
import { HeroVideoSliderClient } from "./hero-video-slider-client";

export async function HeroVideoSlider() {
  const [desktop, mobile] = await Promise.all([blurPlaceholder(heroSlides[0].desktop), blurPlaceholder(heroSlides[0].mobile)]);
  return <HeroVideoSliderClient slides={heroSlides} placeholder={{ desktop, mobile }} />;
}
