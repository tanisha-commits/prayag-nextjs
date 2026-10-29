import "server-only";

/**
 * Integration point for an LLM assistant (descriptions, SEO drafts, summaries). Disabled unless
 * PRAYAG_AI_PROVIDER and PRAYAG_AI_API_KEY are set server-side; nothing here runs in the browser.
 * Callers must send only the fields a task needs (never the whole catalog), store the output as an
 * `ai_suggestions` row for admin approval, and never let it write product data directly.
 */
export interface AiProvider {
  name: string;
  /** Draft text from verified fields only; must not add specs, certifications, prices or warranties. */
  draft(task: "description" | "seo", fields: Record<string, string | string[]>): Promise<string>;
}

export function aiStatus(): { configured: boolean; provider: string | null } {
  const provider = process.env.PRAYAG_AI_PROVIDER?.trim() || null;
  return { configured: !!provider && !!process.env.PRAYAG_AI_API_KEY, provider };
}

export function getAiProvider(): AiProvider | null {
  // No provider is wired yet: return null so features report "not configured" instead of faking output.
  return null;
}
