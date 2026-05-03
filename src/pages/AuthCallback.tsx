import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("AuthCallback mounted, current URL:", window.location.href);
        console.log("Hash:", window.location.hash);
        
        // Get session after OAuth redirect
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log("Session check result:", { session, error });
        
        if (error) throw error;
        
        if (session) {
          console.log("Session found! Redirecting to dashboard...");
          toast.success("Successfully signed in!");
          // Small delay to ensure toast is shown
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 500);
        } else {
          // Check URL hash for tokens
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          console.log("Tokens from hash:", { accessToken: !!accessToken, refreshToken: !!refreshToken });
          
          if (accessToken && refreshToken) {
            console.log("Setting session from hash tokens...");
            // Manually set the session
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            if (sessionError) {
              console.error("Session setting error:", sessionError);
              throw sessionError;
            }
            
            console.log("Session set successfully!");
            toast.success("Successfully signed in!");
            setTimeout(() => {
              navigate("/dashboard", { replace: true });
            }, 500);
          } else {
            console.log("No session or tokens found");
            navigate("/auth", { replace: true });
          }
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        setTimeout(() => {
          navigate("/auth", { replace: true });
        }, 500);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-white mx-auto" />
        <p className="mt-4 text-white/80 font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}