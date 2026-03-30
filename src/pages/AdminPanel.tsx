import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lock, BarChart3, TrendingUp, FileType, Calendar,
  Image as ImageIcon, Users, UserCheck, Radio, Eye
} from "lucide-react";

// Password validated server-side via edge function

interface ConversionRow {
  source_format: string;
  target_format: string;
  file_size_bytes: number | null;
  created_at: string;
}

interface GalleryPhoto {
  id: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  ai_description: string | null;
  created_at: string;
}

interface VisitorRow {
  visitor_id: string;
  session_id: string;
  page: string;
  created_at: string;
}

type Tab = "analytics" | "gallery";

const AdminPanel = () => {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem("admin_auth") === "true");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<Tab>("analytics");

  // Analytics state
  const [conversions, setConversions] = useState<ConversionRow[]>([]);
  const [visitors, setVisitors] = useState<VisitorRow[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  // Computed analytics
  const [totalConversions, setTotalConversions] = useState(0);
  const [todayConversions, setTodayConversions] = useState(0);
  const [formatPairs, setFormatPairs] = useState<{ pair: string; count: number }[]>([]);
  const [dailyConversions, setDailyConversions] = useState<{ date: string; count: number }[]>([]);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [returningVisitors, setReturningVisitors] = useState(0);
  const [liveVisitors, setLiveVisitors] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);

  const storedPassword = () => sessionStorage.getItem("admin_pwd") || "";

  const fetchData = async () => {
    setLoading(true);
    const { data: result, error } = await supabase.functions.invoke("admin-data", {
      body: { password: storedPassword() },
    });
    if (error || !result) {
      setLoading(false);
      return;
    }
    const convRes = { data: result.conversions };
    const visRes = { data: result.visitors };
    const photoRes = { data: result.photos };

    const convData = (convRes.data as ConversionRow[]) || [];
    const visData = (visRes.data as VisitorRow[]) || [];
    const photoData = (photoRes.data as GalleryPhoto[]) || [];

    setConversions(convData);
    setVisitors(visData);
    setPhotos(photoData);

    // Conversion stats
    const today = new Date().toISOString().slice(0, 10);
    setTotalConversions(convData.length);
    setTodayConversions(convData.filter((r) => r.created_at.slice(0, 10) === today).length);

    const pairMap: Record<string, number> = {};
    convData.forEach((r) => {
      const pair = `${r.source_format} → ${r.target_format}`;
      pairMap[pair] = (pairMap[pair] || 0) + 1;
    });
    setFormatPairs(
      Object.entries(pairMap)
        .map(([pair, count]) => ({ pair, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    );

    const dailyMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    convData.forEach((r) => {
      const date = r.created_at.slice(0, 10);
      if (dailyMap[date] !== undefined) dailyMap[date]++;
    });
    setDailyConversions(Object.entries(dailyMap).map(([date, count]) => ({ date, count })));

    // Visitor stats
    const allVisitorIds = visData.map((v) => v.visitor_id);
    const uniqueIds = new Set(allVisitorIds);
    setUniqueVisitors(uniqueIds.size);

    const visitorCounts: Record<string, number> = {};
    allVisitorIds.forEach((id) => {
      visitorCounts[id] = (visitorCounts[id] || 0) + 1;
    });
    setReturningVisitors(Object.values(visitorCounts).filter((c) => c > 1).length);

    const todayVisitorIds = new Set(visData.filter((v) => v.created_at.slice(0, 10) === today).map((v) => v.visitor_id));
    setTodayVisitors(todayVisitorIds.size);

    // "Live" = visited in last 5 minutes
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const liveIds = new Set(visData.filter((v) => v.created_at >= fiveMinAgo).map((v) => v.visitor_id));
    setLiveVisitors(liveIds.size);

    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  // Refresh live visitors every 30s
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const getPublicUrl = (photo: GalleryPhoto & { signed_url?: string }) => {
    return photo.signed_url || "";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate password server-side
    const { data, error } = await supabase.functions.invoke("admin-data", {
      body: { password },
    });
    if (error || !data || data.error) {
      setAuthError("Incorrect password");
    } else {
      sessionStorage.setItem("admin_auth", "true");
      sessionStorage.setItem("admin_pwd", password);
      setAuthenticated(true);
      setAuthError("");
    }
  };

  if (!authenticated) {
    return (
      <>
        <Helmet>
          <title>Admin — Clowd Converter</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center px-4">
            <form onSubmit={handleLogin} className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Lock className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
              </div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
              {authError && <p className="text-destructive text-sm text-center">{authError}</p>}
              <Button type="submit" className="w-full h-11">Unlock</Button>
            </form>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const maxDaily = Math.max(...dailyConversions.map((d) => d.count), 1);

  return (
    <>
      <Helmet>
        <title>Admin Panel — Clowd Converter</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold text-foreground">Admin Panel</h1>
            {liveVisitors > 0 && (
              <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full text-sm font-medium">
                <Radio className="w-3 h-3 animate-pulse" />
                {liveVisitors} live
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {(["analytics", "gallery"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  tab === t
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "analytics" ? "Analytics" : "Gallery"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tab === "analytics" ? (
            <>
              {/* Visitor stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <StatCard icon={Users} label="Unique Visitors" value={uniqueVisitors} />
                <StatCard icon={Eye} label="Today" value={todayVisitors} />
                <StatCard icon={UserCheck} label="Returning" value={returningVisitors} />
                <StatCard icon={Radio} label="Live Now" value={liveVisitors} accent />
              </div>

              {/* Conversion stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <StatCard icon={BarChart3} label="Total Conversions" value={totalConversions} />
                <StatCard icon={TrendingUp} label="Today" value={todayConversions} />
                <StatCard icon={FileType} label="Format Pairs" value={formatPairs.length} />
              </div>

              {/* Daily chart */}
              <div className="bg-card border border-border rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 text-foreground font-semibold mb-4">
                  <Calendar className="w-4 h-4" />
                  Conversions — Last 14 Days
                </div>
                <div className="flex items-end gap-1 h-32">
                  {dailyConversions.map((d) => (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-primary/80 rounded-t transition-all"
                        style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? 4 : 1 }}
                        title={`${d.date}: ${d.count}`}
                      />
                      <span className="text-[9px] text-muted-foreground hidden sm:block">
                        {d.date.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular format pairs */}
              <div className="bg-card border border-border rounded-xl p-5 mb-6">
                <h2 className="text-foreground font-semibold mb-3">Popular Conversions</h2>
                {formatPairs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No conversions yet.</p>
                ) : (
                  <div className="space-y-2">
                    {formatPairs.map((fp) => (
                      <div key={fp.pair} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{fp.pair}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(fp.count / formatPairs[0].count) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">{fp.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent conversions table */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="text-foreground font-semibold mb-3">Recent Conversions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground border-b border-border">
                        <th className="pb-2">From</th>
                        <th className="pb-2">To</th>
                        <th className="pb-2">Size</th>
                        <th className="pb-2">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversions.slice(0, 20).map((c, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2 text-foreground">{c.source_format}</td>
                          <td className="py-2 text-foreground">{c.target_format}</td>
                          <td className="py-2 text-muted-foreground">
                            {c.file_size_bytes ? `${(c.file_size_bytes / (1024 * 1024)).toFixed(1)} MB` : "—"}
                          </td>
                          <td className="py-2 text-muted-foreground">
                            {new Date(c.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {conversions.length === 0 && (
                    <p className="text-muted-foreground text-sm py-4 text-center">No conversions yet.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Gallery tab */
            <>
              <p className="text-muted-foreground text-sm mb-6">
                Auto-saved from conversions when AI detects a female. ({photos.length} items)
              </p>
              {photos.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-muted-foreground">No photos yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                      {photo.mime_type?.startsWith("video/") ? (
                        <video
                          src={getPublicUrl(photo.file_path)}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                          onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                        />
                      ) : (
                        <img
                          src={getPublicUrl(photo.file_path)}
                          alt={photo.ai_description || photo.file_name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <div>
                          <p className="text-background text-xs font-medium truncate">{photo.file_name}</p>
                          {photo.ai_description && (
                            <p className="text-background/70 text-[10px] truncate">{photo.ai_description}</p>
                          )}
                          <p className="text-background/50 text-[10px]">
                            {new Date(photo.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

const StatCard = ({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent?: boolean }) => (
  <div className="bg-card border border-border rounded-xl p-4">
    <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
    <p className={`text-2xl font-bold ${accent ? "text-green-600 dark:text-green-400" : "text-foreground"}`}>
      {value}
    </p>
  </div>
);

export default AdminPanel;
