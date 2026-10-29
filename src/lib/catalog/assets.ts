/**
 * Live Drupal file path -> local public path (same naming as scripts/catalog/copy-assets.py):
 * /sites/default/files/2024-07/Drip%20Free%20Design.webp -> /sites/prayag/files/2024-07/Drip-Free-Design.webp
 */
export function localAsset(src: string): string {
  let p: string;
  try {
    p = decodeURIComponent(new URL(src, "https://prayagindia.com").pathname);
  } catch {
    return src;
  }
  if (!p.startsWith("/sites/default/files/")) return src;
  const rest = p.slice("/sites/default/files/".length);
  const i = rest.lastIndexOf("/");
  const dir = i >= 0 ? rest.slice(0, i + 1) : "";
  const name = rest.slice(i + 1).replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return `/sites/prayag/files/${dir}${name}`;
}
