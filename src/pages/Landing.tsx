import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileText, Target, Zap, Shield, Brain, TrendingUp, Upload, Search, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: Brain, title: "AI Resume Review", desc: "GPT-grade analysis of strengths, weaknesses, and role-fit, written like a senior recruiter." },
  { icon: Target, title: "ATS Match Score", desc: "Get an exact percentage score showing how well your resume matches the job description." },
  { icon: Search, title: "Missing Keywords", desc: "Surface the exact keywords your resume lacks — the ones recruiters and bots actually scan for." },
  { icon: TrendingUp, title: "Skill Gap Coaching", desc: "Personalized advice on which skills to learn next to land the role you want." },
  { icon: Zap, title: "Instant Results", desc: "Upload, paste, click. No setup, no waiting. Insights in under 10 seconds." },
  { icon: Shield, title: "Private & Secure", desc: "Your resumes never leave our encrypted backend. We never train on your data." },
];

const steps = [
  { n: "01", title: "Paste the job", desc: "Drop in any job description — from LinkedIn, Indeed, the company site, anywhere." },
  { n: "02", title: "Upload your resume", desc: "Attach your CV as a PDF. We extract every line of text instantly." },
  { n: "03", title: "Get AI insights", desc: "Score, keywords, coaching, and a recruiter-style review — all in one place." },
];

const testimonials = [
  { name: "Maya Chen", role: "Software Engineer @ Stripe", quote: "Used ATSPilot before applying to FAANG roles. Went from 2% callback rate to 40%. The keyword analysis is unreal." },
  { name: "Jamal Rivera", role: "Product Designer", quote: "The skill-gap section literally told me which Figma plugins to mention. Got the offer two weeks later." },
  { name: "Priya Krishnan", role: "Data Scientist", quote: "I tweaked my resume based on the percentage score. Hit 92% match and landed the interview the same day." },
];

export default function Landing() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-hero" />
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-8"
          >
            <Sparkles className="size-3.5 text-primary-glow" />
            <span>Powered by next-gen AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] mb-6"
          >
            AI-Powered
            <br />
            <span className="gradient-text">ATS Resume Analyzer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Beat the bots. Get instant ATS scores, missing keywords, and brutally honest AI feedback —
            tailored to every job you apply for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button variant="hero" size="lg" onClick={() => nav("/auth")}>
              Analyze my resume <ArrowRight className="size-4" />
            </Button>
            <Button variant="glass" size="lg" onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}>
              See how it works
            </Button>
          </motion.div>

          {/* floating preview card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 relative"
          >
            <div className="glass rounded-3xl p-8 max-w-3xl mx-auto animate-float">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center">
                    <FileText className="size-5 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">resume_v3.pdf</div>
                    <div className="text-xs text-muted-foreground">Senior Frontend Engineer · Acme Inc.</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-display font-bold gradient-text">87%</div>
                  <div className="text-xs text-muted-foreground">ATS Match</div>
                </div>
              </div>
              <div className="space-y-3">
                {["TypeScript proficiency clearly demonstrated", "Missing: GraphQL, system design", "Strong project ownership signals"].map((t, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-left">
                    <CheckCircle2 className="size-4 text-primary-glow mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything recruiters wish you knew
            </h2>
            <p className="text-muted-foreground text-lg">
              ATSPilot reverse-engineers what hiring systems actually look for — and shows you exactly how to win.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <GlassCard key={f.title} delay={i * 0.05}>
                <div className="size-11 rounded-xl bg-gradient-primary/20 border border-primary/20 grid place-items-center mb-4">
                  <f.icon className="size-5 text-primary-glow" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Three steps to a better resume
            </h2>
            <p className="text-muted-foreground text-lg">No accounts to wire up. No API keys. Just answers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {steps.map((s, i) => (
              <GlassCard key={s.n} delay={i * 0.1}>
                <div className="font-mono text-sm text-primary-glow mb-3">{s.n}</div>
                <h3 className="font-display font-bold text-2xl mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </GlassCard>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button variant="hero" size="lg" onClick={() => nav("/auth")}>
              Try it free <Upload className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Loved by candidates who got hired
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <GlassCard key={t.name} delay={i * 0.05}>
                <p className="text-foreground/90 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-primary grid place-items-center font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <GlassCard className="text-center py-16 px-8 max-w-4xl mx-auto" hover={false}>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to get hired?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Stop guessing what recruiters want. Start applying with confidence.
            </p>
            <Button variant="hero" size="lg" onClick={() => nav("/auth")}>
              Start analyzing — it's free <ArrowRight className="size-4" />
            </Button>
          </GlassCard>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} ATSPilot. Built with AI, for humans.
        </div>
      </footer>
    </div>
  );
}
