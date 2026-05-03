import { Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="container mx-auto px-4 mt-4">
        <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center shadow-glow group-hover:scale-110 transition-smooth">
              <Sparkles className="size-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">ATSPilot</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="/#features" className="hover:text-foreground transition-smooth">Features</a>
            <a href="/#how" className="hover:text-foreground transition-smooth">How it works</a>
            <a href="/#testimonials" className="hover:text-foreground transition-smooth">Reviews</a>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>Dashboard</Button>
                <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Sign in</Button>
                <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>Get started</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
