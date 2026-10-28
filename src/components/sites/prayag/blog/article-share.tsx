import { socialLinks } from "../data";

const ICON = "/sites/prayag/theme";

/**
 * Banner share row. On the source these icons call shareOnFacebook()/shareOnTwitter()/...
 * which are not defined anywhere in the theme, so they do nothing useful; here they are
 * real share links (Facebook, X, LinkedIn) and profile links (YouTube, Instagram).
 */
export function ArticleShare({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: `${ICON}/Facebook.webp` },
    { label: "Share on X (Twitter)", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`, icon: `${ICON}/twitter.webp` },
    { label: "Prayag on YouTube", href: socialLinks.youtube, icon: `${ICON}/Youtube.webp` },
    { label: "Prayag on Instagram", href: socialLinks.instagram, icon: `${ICON}/Instagram.webp` },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: `${ICON}/linkdin.webp` },
  ];
  return (
    <ul className="flex justify-center">
      {links.map((link) => (
        <li key={link.label} className="md:mr-[15px] md:last:mr-0 max-md:mx-[11px]">
          <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
            {/* eslint-disable-next-line @next/next/no-img-element -- 35px source icon on a brand-blue disc */}
            <img src={link.icon} alt="" width={35} height={35} className="size-[35px] rounded-full bg-[#00aeef] p-2 md:p-[5px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
