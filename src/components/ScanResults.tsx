import { motion } from "framer-motion";
import { ScanResult } from "@/types/scanner";
import { VulnerabilityCard } from "./VulnerabilityCard";
import { ShieldCheck, ShieldAlert, Globe, FileCode, Search as SearchIcon, AlertTriangle } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";

export function ScanResults({ result }: { result: ScanResult }) {
  const totalVulns = result.vulnerabilities.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          {totalVulns > 0 ? (
            <ShieldAlert className="h-8 w-8 text-warning" />
          ) : (
            <ShieldCheck className="h-8 w-8 text-success" />
          )}
          <h2 className="text-2xl font-bold text-foreground">Scan Complete</h2>
        </div>
        <p className="font-mono text-sm text-primary">{result.targetUrl}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={<Globe className="h-4 w-4" />} label="Pages Scanned" value={result.pagesScanned} />
        <StatCard icon={<FileCode className="h-4 w-4" />} label="Inputs Found" value={result.inputsFound} />
        <StatCard icon={<SearchIcon className="h-4 w-4" />} label="Issues Found" value={totalVulns} />
        <StatCard icon={<AlertTriangle className="h-4 w-4" />} label="Duration" value={result.duration} />
      </div>

      {/* Severity Summary */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {(["critical", "high", "medium", "low", "info"] as const).map(
          (s) =>
            result.summary[s] > 0 && (
              <div key={s} className="flex items-center gap-1.5">
                <SeverityBadge severity={s} />
                <span className="text-sm font-mono text-muted-foreground">×{result.summary[s]}</span>
              </div>
            )
        )}
      </div>

      {/* Vulnerabilities */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Detected Vulnerabilities
        </h3>
        {result.vulnerabilities.map((vuln, i) => (
          <VulnerabilityCard key={vuln.id} vuln={vuln} index={i} />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 text-xs text-muted-foreground space-y-2">
        <p className="font-semibold text-secondary-foreground">⚠ Important Disclaimer</p>
        <ul className="list-disc list-inside space-y-1">
          <li>This scan covers common, preventable vulnerabilities only</li>
          <li>It is not a replacement for professional penetration testing</li>
          <li>Security testing reduces risk but does not eliminate all threats</li>
          <li>Advanced attackers may exploit vulnerabilities not covered by this tool</li>
        </ul>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-lg p-3 text-center"
    >
      <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">{icon}<span className="text-xs">{label}</span></div>
      <div className="text-lg font-bold font-mono text-foreground">{String(value)}</div>
    </motion.div>
  );
}
