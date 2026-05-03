// Edge function: ATS resume analysis via Lovable AI Gateway
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROMPTS: Record<string, string> = {
  analyze:
    "You are an experienced Technical Human Resource Manager, your task is to review the provided resume against the job description. Please share your professional evaluation on whether the candidate's profile aligns with the role. Highlight the strengths and weaknesses of the applicant in relation to the specified job requirements.",
  improve:
    "You are an Technical Human Resource Manager with expertise in data science, your role is to scrutinize the resume in light of the job description provided. Share your insights on the candidate's suitability for the role from an HR perspective. Additionally, offer advice on enhancing the candidate's skills and identify areas where improvement is needed.",
  keywords:
    "You are an skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality, your task is to evaluate the resume against the provided job description. Assess the compatibility of the resume with the role. Give the missing keywords. Also provide recommendations for improvement.",
  match:
    "You are a skilled ATS scanner. Evaluate the resume against the job description. First give percentage match, then missing keywords, then final thoughts.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { jobDescription, cvText, type } = await req.json();

    if (!jobDescription || !cvText || !type || !PROMPTS[type]) {
      return new Response(JSON.stringify({ error: "Missing or invalid fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (cvText.length > 50000 || jobDescription.length > 20000) {
      return new Response(JSON.stringify({ error: "Inputs too long" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const fullPrompt = `Job Description:\n${jobDescription}\n\nResume/CV:\n${cvText}\n\nInstruction:\n${PROMPTS[type]}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: fullPrompt }],
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds to your Lovable workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiRes.text();
      console.error("AI gateway error", aiRes.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const content = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ result: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
