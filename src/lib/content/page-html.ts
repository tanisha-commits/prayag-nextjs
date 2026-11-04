import "server-only";
import { BASE_PATH } from "@/lib/base-path";

/** The page as this server renders it (used to list which texts are actually on it). */
export async function fetchOwnPage(path: string): Promise<string | undefined> {
  const host = !process.env.HOSTNAME || process.env.HOSTNAME === "0.0.0.0" || process.env.HOSTNAME === "::" ? "127.0.0.1" : process.env.HOSTNAME;
  try {
    const res = await fetch(`http://${host}:${process.env.PORT || 3000}${BASE_PATH}${path === "/" ? "" : path}`, { cache: "no-store", signal: AbortSignal.timeout(15000) });
    return res.ok ? await res.text() : undefined;
  } catch {
    return undefined;
  }
}
