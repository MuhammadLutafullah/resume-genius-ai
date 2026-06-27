import { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "info" | "success" | "warning" | "error";

const config: Record<Variant, { icon: typeof Info; cls: string }> = {
  info: { icon: Info, cls: "bg-info/10 text-info border-info/20" },
  success: { icon: CheckCircle2, cls: "bg-success/10 text-success border-success/20" },
  warning: { icon: AlertCircle, cls: "bg-warning/10 text-warning border-warning/20" },
  error: { icon: XCircle, cls: "bg-destructive/10 text-destructive border-destructive/20" },
};

export function Alert({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: Variant;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  const { icon: Icon, cls } = config[variant];
  return (
    <div className={cn("flex gap-3 rounded-xl border p-4 text-sm", cls, className)}>
      <Icon className="h-5 w-5 shrink-0" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="text-foreground/80">{children}</div>}
      </div>
    </div>
  );
}
