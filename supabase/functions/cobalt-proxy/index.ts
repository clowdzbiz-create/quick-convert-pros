import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, videoQuality, filenameStyle } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ status: "error", text: "Missing url" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiUrl = Deno.env.get("COBALT_API_URL") || "https://sulphurously-exequial-taunya.ngrok-free.dev";

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        videoQuality: videoQuality || "720",
        filenameStyle: filenameStyle || "classic",
      }),
    });

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
