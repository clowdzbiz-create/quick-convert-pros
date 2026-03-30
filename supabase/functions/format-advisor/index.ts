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
    const { fileName, currentFormat, useCase } = await req.json();

    if (!fileName || typeof fileName !== "string") {
      return new Response(
        JSON.stringify({ error: "fileName is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a file format expert for Clowd Converter. Given a file name and optional use case, recommend the best output format. Be concise and helpful.

Respond in this exact JSON format:
{"recommended": "FORMAT", "reason": "One sentence why", "alternatives": [{"format": "FORMAT", "reason": "One sentence"}]}

Rules:
- For video: consider MP4 (universal), WebM (web), MOV (Apple), AVI (legacy)
- For audio: consider MP3 (universal), WAV (lossless), OGG (open), AAC (Apple/streaming), FLAC (audiophile)
- For images: consider JPG (photos, small size), PNG (transparency, screenshots), WebP (web optimization), GIF (animation)
- Consider the use case if provided (e.g., "for web", "for email", "for editing")
- Always provide 1-2 alternatives`;

    const userMessage = `File: "${fileName}"${currentFormat ? `, current format: ${currentFormat}` : ""}${useCase ? `, use case: ${useCase}` : ""}

What format should this be converted to?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "format_recommendation",
              description: "Return a format recommendation with alternatives",
              parameters: {
                type: "object",
                properties: {
                  recommended: { type: "string", description: "Recommended format (e.g. MP3, MP4, PNG)" },
                  reason: { type: "string", description: "One sentence explanation" },
                  alternatives: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        format: { type: "string" },
                        reason: { type: "string" },
                      },
                      required: ["format", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["recommended", "reason", "alternatives"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "format_recommendation" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const recommendation = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(recommendation), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: try to parse content
    const content = data.choices?.[0]?.message?.content || "";
    return new Response(JSON.stringify({ recommended: "MP4", reason: content || "Universal format", alternatives: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("format-advisor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
