import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Cobalt API instances to try (official first, then community fallbacks)
const COBALT_INSTANCES = [
  "https://api.cobalt.tools",
  "https://cobalt-api.kwiatekmiki.com",
  "https://cobalt.api.timelessnesses.me",
];

const URL_PATTERN = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|instagram\.com|tiktok\.com|vm\.tiktok\.com)\//i;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";
    const mode = body.mode === "audio" ? "audio" : "auto";

    if (!url || url.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!URL_PATTERN.test(url)) {
      return new Response(
        JSON.stringify({ error: "Unsupported URL. Only YouTube, Instagram, and TikTok are supported." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cobaltBody = JSON.stringify({
      url,
      downloadMode: mode,
      audioFormat: "mp3",
      videoQuality: "1080",
      filenameStyle: "pretty",
    });

    let lastError = "All instances failed";

    for (const instance of COBALT_INSTANCES) {
      try {
        const resp = await fetch(instance, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: cobaltBody,
        });

        const data = await resp.json();

        if (data.status === "error") {
          lastError = data.error?.code || data.text || "Cobalt returned an error";
          // If auth required, try next instance
          if (resp.status === 401 || resp.status === 403) continue;
          // Other errors, return them
          return new Response(
            JSON.stringify({ error: lastError }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (data.status === "tunnel" || data.status === "redirect") {
          return new Response(
            JSON.stringify({
              status: data.status,
              url: data.url,
              filename: data.filename || "download",
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (data.status === "picker") {
          // Return first item for simplicity
          const firstItem = data.picker?.[0];
          if (firstItem?.url) {
            return new Response(
              JSON.stringify({
                status: "tunnel",
                url: firstItem.url,
                filename: data.filename || firstItem.filename || "download",
              }),
              { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }

        lastError = `Unexpected response status: ${data.status}`;
      } catch (e) {
        lastError = `Instance ${instance} failed: ${e instanceof Error ? e.message : "unknown"}`;
        continue;
      }
    }

    // All instances failed — return fallback flag so frontend can redirect
    return new Response(
      JSON.stringify({ error: lastError, fallback: true }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
