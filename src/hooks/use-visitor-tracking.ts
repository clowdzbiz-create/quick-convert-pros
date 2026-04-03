import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const isBot = () => /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|mediapartners|google|baidu|yandex/i.test(navigator.userAgent);

export const useVisitorTracking = () => {
  useEffect(() => {
    if (isBot()) return;

    // Get or create persistent visitor ID
    let visitorId = localStorage.getItem("clowd_visitor_id");
    if (!visitorId) {
      visitorId = generateId();
      localStorage.setItem("clowd_visitor_id", visitorId);
    }

    // Session ID (per tab/session)
    let sessionId = sessionStorage.getItem("clowd_session_id");
    if (!sessionId) {
      sessionId = generateId();
      sessionStorage.setItem("clowd_session_id", sessionId);
    }

    // Log visit (fire-and-forget)
    supabase.from("visitors").insert({
      visitor_id: visitorId,
      session_id: sessionId,
      page: window.location.pathname,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
    }).then(() => {});
  }, []);
};
