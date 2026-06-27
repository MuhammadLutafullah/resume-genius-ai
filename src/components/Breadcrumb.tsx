import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  patients: "Patients",
  add: "Add Patient",
  edit: "Edit Patient",
  profile: "Profile",
  settings: "Settings",
};

export function Breadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link to="/dashboard" className="flex items-center gap-1 transition-smooth hover:text-foreground">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((seg, i) => {
        const path = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = LABELS[seg] || (seg.length > 12 ? "Details" : seg);
        return (
          <span key={path} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link to={path} className="transition-smooth hover:text-foreground">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
