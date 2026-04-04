import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COBALT_API = "https://sulphurously-exequial-taunya.ngrok-free.dev/api/json";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input = await req.json();

    if (!input.url) {
      return new Response(JSON.stringify({ status: "error", text: "Missing url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build a clean body with only Cobalt-supported fields
    const cobaltBody: Record<string, unknown> = {
      url: input.url,
      videoQuality: input.videoQuality || "720",
      filenameStyle: input.filenameStyle || "classic",
    };

    if (input.isAudioOnly) {
      cobaltBody.isAudioOnly = true;
      cobaltBody.audioFormat = input.audioFormat || "mp3";
    }

    const resp = await fetch(COBALT_API, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cobaltBody),
    });

    const contentType = resp.headers.get("Content-Type") || "";
    if (!contentType.includes("application/json")) {
      const text = await resp.text();
      return new Response(JSON.stringify({
        status: "error",
        text: text.slice(0, 200) || "Cobalt returned a non-JSON response.",
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      status: resp.ok ? 200 : resp.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({
      status: "error",
      text: "Unable to connect to the download server. Please ensure the local Cobalt service is running.",
    }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
