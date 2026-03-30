import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BarChart3, TrendingUp, FileType, Calendar } from "lucide-react";

interface ConversionRow {
  source_format: string;
  target_format: string;
  file_size_bytes: number | null;
  created_at: string;
}

interface FormatPairStat {
  pair: string;
  count: number;
}

interface DailyStat {
  date: string;
  count: number;
}

const Analytics = () => {
  const [conversions, setConversions] = useState<ConversionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [formatPairs, setFormatPairs] = useState<FormatPairStat[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("conversions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error || !data) {
      setLoading(false);
      return;
    }

    setConversions(data as ConversionRow[]);
    setTotalCount(data.length);

    // Today's count
    const today = new Date().toISOString().slice(0, 10);
    setTodayCount(data.filter((r) => r.created_at.slice(0, 10) === today).length);

    // Format pair stats
    const pairMap: Record<string, number> = {};
    data.forEach((r) => {
      const pair = `${r.source_format} → ${r.target_format}`;
      pairMap[pair] = (pairMap[pair] || 0) + 1;
    });
    const pairs = Object.entries(pairMap)
      .map(([pair, count]) => ({ pair, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    setFormatPairs(pairs);

    // Daily stats (last 14 days)
    const dailyMap: Record<string, number> = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    data.forEach((r) => {
      const date = r.created_at.slice(0, 10);
      if (dailyMap[date] !== undefined) dailyMap[date]++;
    });
    setDailyStats(Object.entries(dailyMap).map(([date, count]) => ({ date, count })));

    setLoading(false);
  };

  const maxDaily = Math.max(...dailyStats.map((d) => d.count), 1);

  return (
    <>
      <Helmet>
        <title>Conversion Analytics — Clowd Converter</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-6">Conversion Analytics</h1>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <BarChart3 className="w-4 h-4" />
                    Total Conversions
                  </div>
                  <p className="text-3xl font-bold text-foreground">{totalCount}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    Today
                  </div>
                  <p className="text-3xl font-bold text-foreground">{todayCount}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <FileType className="w-4 h-4" />
                    Unique Format Pairs
                  </div>
                  <p className="text-3xl font-bold text-foreground">{formatPairs.length}</p>
                </div>
              </div>

              {/* Daily chart */}
              <div className="bg-card border border-border rounded-xl p-5 mb-8">
                <div className="flex items-center gap-2 text-foreground font-semibold mb-4">
                  <Calendar className="w-4 h-4" />
                  Last 14 Days
                </div>
                <div className="flex items-end gap-1 h-32">
                  {dailyStats.map((d) => (
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
              <div className="bg-card border border-border rounded-xl p-5 mb-8">
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

              {/* Recent conversions */}
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
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Analytics;
