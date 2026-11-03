import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/server";
import { BASE_PATH } from "@/lib/base-path";

const handler = toNextJsHandler(auth);

// Better Auth routes on the public path (<base path>/api/auth/...). Next.js hands route handlers the
// URL without the base path, so put it back before dispatching.
async function withBasePath(req: Request): Promise<Request> {
  const url = new URL(req.url);
  if (!BASE_PATH || url.pathname.startsWith(`${BASE_PATH}/`)) return req;
  url.pathname = `${BASE_PATH}${url.pathname}`;
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  return new Request(url, { method: req.method, headers: req.headers, body: hasBody ? await req.arrayBuffer() : undefined, signal: req.signal });
}

export const GET = async (req: Request) => handler.GET(await withBasePath(req));
export const POST = async (req: Request) => handler.POST(await withBasePath(req));
