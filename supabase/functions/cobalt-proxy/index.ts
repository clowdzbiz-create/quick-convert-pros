import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COBALT_API = "https://sulphurously-exequial-taunya.ngrok-free.dev";
const COBALT_HOST = "sulphurously-exequial-taunya.ngrok-free.dev";
const FUNCTION_PATH = "/functions/v1/cobalt-proxy";

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isAllowedTunnelUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === COBALT_HOST && url.pathname === "/tunnel";
  } catch {
    return false;
  }
};

const buildProxyUrl = (target: string) => {
  if (!isAllowedTunnelUrl(target)) {
    return target;
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const proxyUrl = new URL(`${supabaseUrl}${FUNCTION_PATH}`);
  proxyUrl.searchParams.set("download", target);
  return proxyUrl.toString();
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestUrl = new URL(req.url);
  const downloadTarget = requestUrl.searchParams.get("download");

  if (req.method === "GET" && downloadTarget) {
    if (!isAllowedTunnelUrl(downloadTarget)) {
      return jsonResponse({ status: "error", text: "Invalid download URL." }, 400);
    }

    try {
      const upstream = await fetch(downloadTarget, {
        method: "GET",
        headers: { Accept: "*/*" },
      });

      if (!upstream.ok || !upstream.body) {
        return jsonResponse({
          status: "error",
          text: "Unable to fetch the media file from the download server.",
        }, 502);
      }

      const headers = new Headers({
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      });

      const contentType = upstream.headers.get("Content-Type");
      const contentDisposition = upstream.headers.get("Content-Disposition");

      if (contentType) {
        headers.set("Content-Type", contentType);
      }

      if (contentDisposition) {
        headers.set("Content-Disposition", contentDisposition);
      }

      return new Response(upstream.body, {
        status: upstream.status,
        headers,
      });
    } catch {
      return jsonResponse({
        status: "error",
        text: "Unable to fetch the media file from the download server.",
      }, 502);
    }
  }

  if (req.method !== "POST") {
    return jsonResponse({ status: "error", text: "Method not allowed." }, 405);
  }

  try {
    const input = await req.json();

    if (!input.url) {
      return jsonResponse({ status: "error", text: "Missing url" }, 400);
    }

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
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cobaltBody),
    });

    const contentType = resp.headers.get("Content-Type") || "";
    if (!contentType.includes("application/json")) {
      const text = await resp.text();
      return jsonResponse({
        status: "error",
        text: text.slice(0, 200) || "Cobalt returned a non-JSON response.",
      }, 502);
    }

    const data = await resp.json();

    if (typeof data?.url === "string") {
      data.url = buildProxyUrl(req, data.url);
    }

    if (Array.isArray(data?.picker)) {
      data.picker = data.picker.map((item: Record<string, unknown>) =>
        typeof item.url === "string"
          ? { ...item, url: buildProxyUrl(req, item.url) }
          : item,
      );
    }

    return new Response(JSON.stringify(data), {
      status: resp.ok ? 200 : resp.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return jsonResponse({
      status: "error",
      text: "Unable to connect to the download server. Please ensure the local Cobalt service is running.",
    }, 502);
  }
});
