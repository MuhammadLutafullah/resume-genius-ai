import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Trash2, Loader2, Brain, Target, Search, TrendingUp, History, X, Copy, Download } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { extractTextFromPDF } from "@/lib/pdf";
import { ANALYSIS_LABELS, AnalysisType, extractPercentage, getLLMResponse } from "@/lib/ats";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";

const ACTIONS: { type: AnalysisType; label: string; icon: any; desc: string }[] = [
  { type: "analyze", label: "Analyze Resume", icon: Brain, desc: "Recruiter-style review" },
  { type: "match", label: "ATS Score", icon: Target, desc: "Percentage match" },
  { type: "keywords", label: "Missing Keywords", icon: Search, desc: "What's missing" },
  { type: "improve", label: "Improve Skills", icon: TrendingUp, desc: "Coaching advice" },
];

type Result = { type: AnalysisType; content: string; score: number | null };

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();

  const [jd, setJd] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [busy, setBusy] = useState<AnalysisType | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) nav("/auth");
  }, [user, authLoading, nav]);

  const loadHistory = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    setHistory(data || []);
  }, [user]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  const handleFile = async (f: File | null) => {
    if (!f) return;
    if (f.type !== "application/pdf") { toast.error("Please upload a PDF file"); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error("File too large (max 10MB)"); return; }
    setFile(f);
    setExtracting(true);
    try {
      const text = await extractTextFromPDF(f);
      if (!text.trim()) throw new Error("No text found in PDF");
      setCvText(text);
      toast.success(`Extracted ${text.length.toLocaleString()} characters`);
    } catch (e: any) {
      toast.error(e.message || "Failed to read PDF");
      setFile(null);
    } finally {
      setExtracting(false);
    }
  };

  const run = async (type: AnalysisType) => {
    if (!jd.trim()) { toast.error("Add a job description first"); return; }
    if (!cvText.trim()) { toast.error("Upload your resume first"); return; }
    setBusy(type);
    setResult(null);
    try {
      const content = await getLLMResponse(jd, cvText, type);
      const score = type === "match" ? extractPercentage(content) : null;
      setResult({ type, content, score });

      await supabase.from("analyses").insert({
        user_id: user!.id,
        job_description: jd,
        resume_text: cvText.slice(0, 20000),
        analysis_type: type,
        result: content,
      });
      loadHistory();
    } catch (e: any) {
      toast.error(e.message || "Analysis failed");
    } finally {
      setBusy(null);
    }
  };

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.content);
    toast.success("Copied to clipboard");
  };

  const downloadPdf = () => {
    if (!result) return;
    const doc = new jsPDF();
    const title = ANALYSIS_LABELS[result.type];
    doc.setFontSize(18);
    doc.text("ATSPilot — " + title, 14, 20);
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(result.content, 180);
    doc.text(lines, 14, 32);
    doc.save(`atspilot-${result.type}-${Date.now()}.pdf`);
  };

  const removeHistory = async (id: string) => {
    await supabase.from("analyses").delete().eq("id", id);
    loadHistory();
    toast.success("Deleted");
  };

  if (authLoading) return <div className="min-h-screen grid place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="container mx-auto px-4 pt-32">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Your <span className="gradient-text">analysis</span> studio
            </h1>
            <p className="text-muted-foreground mt-2">Drop in a JD and your resume to get instant insights.</p>
          </div>
          <Button variant="glass" onClick={() => setHistoryOpen(true)}>
            <History className="size-4" /> History ({history.length})
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          {/* JD */}
          <GlassCard hover={false}>
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3 block">
              Job description
            </label>
            <Textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here…"
              className="min-h-[280px] bg-transparent border-border/40 resize-none font-sans"
              maxLength={20000}
            />
            <div className="text-xs text-muted-foreground mt-2 text-right">{jd.length} / 20000</div>
          </GlassCard>

          {/* Resume */}
          <GlassCard hover={false}>
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3 block">
              Resume (PDF)
            </label>
            <label className="block">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              <div className="border-2 border-dashed border-border/60 hover:border-primary/40 rounded-xl p-8 cursor-pointer transition-smooth text-center min-h-[280px] grid place-items-center">
                {extracting ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="size-8 animate-spin text-primary" />
                    <div className="text-sm text-muted-foreground">Extracting text…</div>
                  </div>
                ) : file ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center">
                      <FileText className="size-6 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs text-muted-foreground">{cvText.length.toLocaleString()} chars · click to replace</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="size-12 rounded-xl bg-secondary grid place-items-center">
                      <Upload className="size-6 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">Drop your PDF or click to browse</div>
                      <div className="text-xs text-muted-foreground">Max 10MB</div>
                    </div>
                  </div>
                )}
              </div>
            </label>
          </GlassCard>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {ACTIONS.map((a) => (
            <motion.button
              key={a.type}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => run(a.type)}
              disabled={!!busy}
              className="glass rounded-2xl p-5 text-left transition-smooth hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="size-10 rounded-xl bg-gradient-primary/20 border border-primary/20 grid place-items-center group-hover:bg-gradient-primary group-hover:border-transparent transition-smooth">
                  {busy === a.type ? <Loader2 className="size-4 animate-spin text-primary-glow" /> : <a.icon className="size-4 text-primary-glow group-hover:text-primary-foreground transition-smooth" />}
                </div>
              </div>
              <div className="font-display font-semibold">{a.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
            </motion.button>
          ))}
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {busy && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <Loader2 className="size-10 animate-spin text-primary mx-auto mb-4" />
              <div className="font-display text-xl font-semibold mb-1">Analyzing…</div>
              <div className="text-sm text-muted-foreground">{ANALYSIS_LABELS[busy]} in progress.</div>
            </motion.div>
          )}

          {result && !busy && (
            <motion.div
              key={result.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <GlassCard hover={false} className="p-8">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div>
                    <div className="text-xs font-mono text-primary-glow uppercase tracking-wider">Result</div>
                    <h2 className="font-display text-2xl font-bold mt-1">{ANALYSIS_LABELS[result.type]}</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyResult}><Copy className="size-3.5" /> Copy</Button>
                    <Button variant="outline" size="sm" onClick={downloadPdf}><Download className="size-3.5" /> PDF</Button>
                  </div>
                </div>

                {result.score !== null && (
                  <div className="mb-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-sm text-muted-foreground">ATS Match</span>
                      <span className="font-display text-4xl font-bold gradient-text">{result.score}%</span>
                    </div>
                    <Progress value={result.score} className="h-2" />
                  </div>
                )}

                <div className="prose prose-invert max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed text-[15px]">
                  {result.content}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* History sheet */}
      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setHistoryOpen(false)}
              className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] glass z-50 overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold">Your history</h3>
                <Button variant="ghost" size="icon" onClick={() => setHistoryOpen(false)}><X className="size-4" /></Button>
              </div>
              {history.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-12">No analyses yet.</div>
              ) : (
                <div className="space-y-3">
                  {history.map((h) => (
                    <div key={h.id} className="rounded-xl border border-border/40 p-4 bg-card/40 hover:border-primary/30 transition-smooth">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-mono text-primary-glow uppercase">{ANALYSIS_LABELS[h.analysis_type as AnalysisType]}</div>
                        <button onClick={() => removeHistory(h.id)} className="text-muted-foreground hover:text-destructive transition-smooth">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <div className="text-sm line-clamp-3 text-foreground/80 mb-2">{h.result}</div>
                      <div className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleString()}</div>
                      <button
                        onClick={() => {
                          setResult({ type: h.analysis_type, content: h.result, score: h.analysis_type === "match" ? extractPercentage(h.result) : null });
                          setJd(h.job_description);
                          setCvText(h.resume_text);
                          setHistoryOpen(false);
                        }}
                        className="text-xs text-primary-glow hover:underline mt-2"
                      >
                        Open →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
