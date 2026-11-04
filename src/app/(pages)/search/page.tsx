import { redirect } from "next/navigation";

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const raw = params.keys ?? params.q;
  const keys = (Array.isArray(raw) ? raw[0] : raw)?.trim();
  redirect(keys ? `/search/node?keys=${encodeURIComponent(keys)}` : "/search/node");
}
