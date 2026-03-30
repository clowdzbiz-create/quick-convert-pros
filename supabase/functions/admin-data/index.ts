import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password } = await req.json();

    if (!password || password !== Deno.env.get("ADMIN_PASSWORD")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const [convRes, visRes, photoRes] = await Promise.all([
      supabase.from("conversions").select("*").order("created_at", { ascending: false }).limit(1000),
      supabase.from("visitors").select("*").order("created_at", { ascending: false }).limit(1000),
      supabase.from("gallery_photos").select("*").order("created_at", { ascending: false }).limit(200),
    ]);

    // Generate signed URLs for gallery photos (bucket is private)
    const photos = photoRes.data || [];
    const photosWithUrls = await Promise.all(
      photos.map(async (photo: any) => {
        const { data } = await supabase.storage.from("gallery").createSignedUrl(photo.file_path, 3600);
        return { ...photo, signed_url: data?.signedUrl || null };
      })
    );

    return new Response(
      JSON.stringify({
        conversions: convRes.data || [],
        visitors: visRes.data || [],
        photos: photosWithUrls,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("admin-data error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
