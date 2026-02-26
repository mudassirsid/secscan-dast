import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VerificationStep({
  url,
  token,
  onVerify,
  isVerifying,
}: {
  url: string;
  token: string;
  onVerify: () => void;
  isVerifying: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const metaTag = `<meta name="security-verification" content="${token}">`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(metaTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [metaTag]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Verify Ownership</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          To prove you control <span className="font-mono text-primary">{url}</span>, add the following META tag
          to your homepage's <code className="text-primary font-mono">&lt;head&gt;</code> section.
        </p>
      </div>

      <div className="bg-secondary/50 border border-border rounded-lg p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Code className="h-3.5 w-3.5" />
            <span className="font-mono">HTML META Tag</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 mr-1" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 mr-1" /> Copy
              </>
            )}
          </Button>
        </div>
        <pre className="font-mono text-sm text-primary overflow-x-auto whitespace-pre-wrap break-all">
          {metaTag}
        </pre>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground space-y-2">
        <p className="font-semibold text-secondary-foreground">Instructions:</p>
        <ol className="list-decimal list-inside space-y-1 text-xs">
          <li>Open your website's homepage HTML file</li>
          <li>
            Paste the META tag inside the <code className="font-mono text-primary">&lt;head&gt;</code> section
          </li>
          <li>Deploy or save the changes</li>
          <li>Click "Verify Ownership" below</li>
        </ol>
        <p className="text-xs italic mt-2">
          The token is safe to be publicly visible — it only proves you have write access to the site.
        </p>
      </div>

      <div className="flex justify-center">
        <Button onClick={onVerify} disabled={isVerifying} size="lg" className="font-semibold">
          {isVerifying ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
              />
              Verifying…
            </>
          ) : (
            "Verify Ownership"
          )}
        </Button>
      </div>
    </motion.div>
  );
}
