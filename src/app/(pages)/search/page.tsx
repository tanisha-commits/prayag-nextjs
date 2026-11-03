import { redirect } from "next/navigation";

// The source's search lives at /search/node?keys=… (rebuilt in ./node). Older local links to
// /search?q=… or /search?keys=… land there with their terms.
export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const raw = params.keys ?? params.q;
  const keys = (Array.isArray(raw) ? raw[0] : raw)?.trim();
  redirect(keys ? `/search/node?keys=${encodeURIComponent(keys)}` : "/search/node");
}
