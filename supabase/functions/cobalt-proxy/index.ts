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

  try {
    const { url, videoQuality, filenameStyle, downloadMode } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ status: "error", text: "Missing url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: Record<string, unknown> = {
      url,
      videoQuality: videoQuality || "720",
      filenameStyle: filenameStyle || "classic",
    };

    // If audio-only requested
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

    const data = await resp.json();

    // If cobalt returns a tunnel URL, we need to proxy the file through
    if (data.status === "tunnel" && data.url) {
      const tunnelResp = await fetch(data.url);
      if (!tunnelResp.ok) {
        return new Response(JSON.stringify({ status: "error", text: "Tunnel download failed" }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const filename = data.filename || "download";
      return new Response(tunnelResp.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": tunnelResp.headers.get("Content-Type") || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": tunnelResp.headers.get("Content-Length") || "",
        },
      });
    }

    // If cobalt returns a redirect URL, also proxy it
    if (data.status === "redirect" && data.url) {
      const redirectResp = await fetch(data.url);
      if (!redirectResp.ok) {
        return new Response(JSON.stringify({ status: "error", text: "Redirect download failed" }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const filename = data.filename || "download";
      return new Response(redirectResp.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": redirectResp.headers.get("Content-Type") || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": redirectResp.headers.get("Content-Length") || "",
        },
      });
    }

    // Pass through other responses (errors, etc.)
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
