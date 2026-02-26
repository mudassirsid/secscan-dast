import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, token } = await req.json();

    if (!url || !token) {
      return new Response(
        JSON.stringify({ success: false, error: "URL and token are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid URL format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the homepage
    console.log("Fetching URL for verification:", targetUrl.toString());
    const response = await fetch(targetUrl.toString(), {
      headers: { "User-Agent": "SecScan-Verifier/1.0" },
      redirect: "follow",
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: `Failed to fetch site: HTTP ${response.status}` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const html = await response.text();

    // Check for the meta tag
    const metaRegex = new RegExp(
      `<meta\\s+name=["']security-verification["']\\s+content=["']${token}["']\\s*/?>`,
      "i"
    );
    // Also check reverse attribute order
    const metaRegexAlt = new RegExp(
      `<meta\\s+content=["']${token}["']\\s+name=["']security-verification["']\\s*/?>`,
      "i"
    );

    const verified = metaRegex.test(html) || metaRegexAlt.test(html);

    return new Response(
      JSON.stringify({ success: true, verified }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
