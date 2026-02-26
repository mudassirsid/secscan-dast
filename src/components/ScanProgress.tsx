import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const phases = [
  "Crawling verified domain…",
  "Mapping site structure…",
  "Identifying input points…",
  "Testing for XSS vectors…",
  "Checking CSRF protections…",
  "Analyzing security headers…",
  "Inspecting cookie configuration…",
  "Testing for open redirects…",
  "Generating report…",
];

export function ScanProgress({ onComplete }: { onComplete: () => void }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 4 + 1;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const phaseIndex = Math.min(Math.floor((progress / 100) * phases.length), phases.length - 1);
    setCurrentPhase(phaseIndex);
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 text-center"
    >
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Scanning in Progress</h2>
        <p className="text-sm text-muted-foreground">
          Performing authorized, non-destructive security tests…
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-3">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>{phases[currentPhase]}</span>
          <span>{Math.round(Math.min(progress, 100))}%</span>
        </div>
      </div>

      {/* Animated scan visualization */}
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 rounded-full border border-border" />
        <div className="absolute inset-4 rounded-full border border-border" />
        <div className="absolute inset-8 rounded-full border border-border" />
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
        >
          <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left bg-gradient-to-r from-primary to-transparent" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-primary animate-pulse-glow" />
        </div>
      </div>
    </motion.div>
  );
}
