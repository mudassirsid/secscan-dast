import { cn } from "@/lib/utils";
import { SeverityLevel } from "@/types/scanner";

const severityConfig: Record<SeverityLevel, { label: string; className: string }> = {
  critical: { label: "CRITICAL", className: "bg-destructive/20 text-destructive border-destructive/30" },
  high: { label: "HIGH", className: "bg-destructive/10 text-destructive border-destructive/20" },
  medium: { label: "MEDIUM", className: "bg-warning/10 text-warning border-warning/20" },
  low: { label: "LOW", className: "bg-primary/10 text-primary border-primary/20" },
  info: { label: "INFO", className: "bg-muted text-muted-foreground border-border" },
};

export function SeverityBadge({ severity, className }: { severity: SeverityLevel; className?: string }) {
  const config = severityConfig[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded font-mono text-xs font-semibold border tracking-wider",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
