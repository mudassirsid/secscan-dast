import { ScanResult } from "@/types/scanner";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function generateToken(): string {
  const chars = "abcdef0123456789";
  let token = "sv-";
  for (let i = 0; i < 32; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

export async function verifyOwnership(url: string, token: string): Promise<{ verified: boolean; error?: string }> {
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/verify-ownership`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ url, token }),
    });

    const data = await resp.json();
    if (!data.success) {
      return { verified: false, error: data.error || "Verification failed" };
    }
    return { verified: data.verified };
  } catch (err) {
    return { verified: false, error: err instanceof Error ? err.message : "Network error" };
  }
}

export async function runSecurityScan(url: string): Promise<{ result?: ScanResult; error?: string }> {
  try {
    const resp = await fetch(`${SUPABASE_URL}/functions/v1/security-scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({ url }),
    });

    if (resp.status === 429) {
      return { error: "Rate limit exceeded. Please try again in a moment." };
    }
    if (resp.status === 402) {
      return { error: "AI credits exhausted. Please add credits in Settings." };
    }

    const data = await resp.json();
    if (!data.success) {
      return { error: data.error || "Scan failed" };
    }
    return { result: data.result };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}
