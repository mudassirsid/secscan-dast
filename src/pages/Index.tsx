import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VerificationStep } from "@/components/VerificationStep";
import { ScanProgress } from "@/components/ScanProgress";
import { ScanResults } from "@/components/ScanResults";
import { generateToken, getMockScanResult } from "@/lib/scanner";
import { ScanPhase, ScanResult } from "@/types/scanner";

const Index = () => {
  const [phase, setPhase] = useState<ScanPhase>("idle");
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const handleSubmitUrl = useCallback(() => {
    if (!url.trim()) return;
    let formatted = url.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = `https://${formatted}`;
    }
    setUrl(formatted);
    setToken(generateToken());
    setPhase("token-generated");
  }, [url]);

  const handleVerify = useCallback(() => {
    setPhase("verifying");
    // Simulate verification delay
    setTimeout(() => {
      setPhase("verified");
      setTimeout(() => setPhase("scanning"), 1500);
    }, 2000);
  }, []);

  const handleScanComplete = useCallback(() => {
    setScanResult(getMockScanResult(url));
    setPhase("complete");
  }, [url]);

  const handleReset = useCallback(() => {
    setPhase("idle");
    setUrl("");
    setToken("");
    setScanResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      {/* Subtle overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container max-w-4xl mx-auto flex items-center justify-between py-4 px-4">
            <div className="flex items-center gap-2.5">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg text-foreground tracking-tight">SecScan</span>
              <span className="text-xs font-mono text-muted-foreground hidden sm:inline">v1.0</span>
            </div>
            {phase !== "idle" && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                New Scan
              </Button>
            )}
          </div>
        </header>

        <main className="container max-w-3xl mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {/* IDLE — Hero + URL input */}
            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Shield className="h-16 w-16 text-primary mx-auto text-glow-intense" />
                  </motion.div>
                  <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                    Authorized Security
                    <br />
                    <span className="text-primary text-glow">Scanner</span>
                  </h1>
                  <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Verify site ownership. Perform non-destructive security testing. Get AI-powered vulnerability reports with actionable fixes.
                  </p>
                </div>

                <div className="max-w-xl mx-auto">
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmitUrl()}
                      className="font-mono text-sm bg-card border-border focus:border-primary h-12"
                    />
                    <Button onClick={handleSubmitUrl} size="lg" className="h-12 px-6 font-semibold shrink-0">
                      Scan <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Ownership verification required before scanning begins.
                  </p>
                </div>

                {/* Features */}
                <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {[
                    { title: "Ownership First", desc: "META tag verification ensures you control the target" },
                    { title: "Non-Destructive", desc: "Safe payloads only — no DoS, no brute force, no data extraction" },
                    { title: "AI-Powered Reports", desc: "Clear explanations, attack scenarios, and remediation steps" },
                  ].map((f, i) => (
                    <motion.div
                      key={f.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="bg-card border border-border rounded-lg p-4 text-center"
                    >
                      <h3 className="font-semibold text-sm text-foreground mb-1">{f.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <p className="text-center text-xs text-muted-foreground italic">
                  This tool is for defensive security testing only and is not a replacement for professional penetration testing.
                </p>
              </motion.div>
            )}

            {/* TOKEN GENERATED — Verification step */}
            {(phase === "token-generated" || phase === "verifying") && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <VerificationStep
                  url={url}
                  token={token}
                  onVerify={handleVerify}
                  isVerifying={phase === "verifying"}
                />
              </motion.div>
            )}

            {/* VERIFIED — Brief success */}
            {phase === "verified" && (
              <motion.div
                key="verified"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-4 py-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-success" />
                  </div>
                </motion.div>
                <h2 className="text-xl font-semibold text-foreground">Ownership Verified</h2>
                <p className="text-sm text-muted-foreground">Starting authorized security scan…</p>
              </motion.div>
            )}

            {/* SCANNING — Progress */}
            {phase === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ScanProgress onComplete={handleScanComplete} />
              </motion.div>
            )}

            {/* COMPLETE — Results */}
            {phase === "complete" && scanResult && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ScanResults result={scanResult} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Index;
