import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COBALT_API = "https://sulphurously-exequial-taunya.ngrok-free.dev";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // Proxy endpoint: /cobalt-proxy?tunnel=<encoded_url>
  const tunnelUrl = url.searchParams.get("tunnel");
  if (tunnelUrl && req.method === "GET") {
    try {
      const tunnelResp = await fetch(tunnelUrl);
      if (!tunnelResp.ok || !tunnelResp.body) {
        return new Response("Tunnel fetch failed", { status: 502, headers: corsHeaders });
      }
      return new Response(tunnelResp.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": tunnelResp.headers.get("Content-Type") || "application/octet-stream",
          "Content-Disposition": tunnelResp.headers.get("Content-Disposition") || 'attachment; filename="download"',
          ...(tunnelResp.headers.get("Content-Length") ? { "Content-Length": tunnelResp.headers.get("Content-Length")! } : {}),
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ status: "error", text: e.message }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  // Main POST: get download info from cobalt
  try {
    const { url: mediaUrl, videoQuality, filenameStyle, downloadMode } = await req.json();

    if (!mediaUrl) {
      return new Response(JSON.stringify({ status: "error", text: "Missing url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: Record<string, unknown> = {
      url: mediaUrl,
      videoQuality: videoQuality || "720",
      filenameStyle: filenameStyle || "classic",
    };

    if (downloadMode === "audio") {
      body.isAudioOnly = true;
      body.audioFormat = "mp3";
    }

    const resp = await fetch(COBALT_API, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseContentType = resp.headers.get("Content-Type") || "";
    if (!responseContentType.includes("application/json")) {
      const text = await resp.text();
      return new Response(JSON.stringify({
        status: "error",
        text: text.slice(0, 180) || "Cobalt API returned an unexpected response.",
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();

    return new Response(JSON.stringify(data), {
      status: resp.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ status: "error", text: e.message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
