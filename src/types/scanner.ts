export type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";

export type VulnerabilityType =
  | "reflected-xss"
  | "stored-xss"
  | "csrf"
  | "sql-injection"
  | "open-redirect"
  | "missing-headers"
  | "insecure-cookies";

export interface Vulnerability {
  id: string;
  url: string;
  type: VulnerabilityType;
  severity: SeverityLevel;
  title: string;
  description: string;
  exploitScenario: string;
  remediation: string;
  owaspCategory: string;
}

export interface ScanResult {
  targetUrl: string;
  scanDate: string;
  duration: string;
  pagesScanned: number;
  inputsFound: number;
  vulnerabilities: Vulnerability[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export type ScanPhase =
  | "idle"
  | "url-input"
  | "token-generated"
  | "verifying"
  | "verified"
  | "scanning"
  | "complete";
