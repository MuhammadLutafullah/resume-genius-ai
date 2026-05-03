import { supabase } from "@/integrations/supabase/client";

export type AnalysisType = "analyze" | "improve" | "keywords" | "match";

export const ANALYSIS_LABELS: Record<AnalysisType, string> = {
  analyze: "Resume Analysis",
  improve: "Skill Improvement",
  keywords: "Missing Keywords",
  match: "ATS Match Score",
};

export async function getLLMResponse(
  jobDescription: string,
  cvText: string,
  type: AnalysisType
): Promise<string> {
  const { data, error } = await supabase.functions.invoke("analyze-resume", {
    body: { jobDescription, cvText, type },
  });
  if (error) {
    // Try to surface friendly message returned by edge function
    const msg = (error as any)?.context?.error || error.message || "Request failed";
    throw new Error(msg);
  }
  if ((data as any)?.error) throw new Error((data as any).error);
  return (data as any).result as string;
}

export function extractPercentage(text: string): number | null {
  const m = text.match(/(\d{1,3})\s*%/);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return isNaN(n) ? null : Math.min(100, Math.max(0, n));
}
