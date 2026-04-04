import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { getDownloaderBySlug, DOWNLOADER_PLATFORMS } from "@/lib/downloader-data";
import { Download, ArrowRight, CheckCircle2, Link2, Video, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useId, useState } from "react";

const PlatformIcon = ({ icon, className, style }: { icon: string; className?: string; style?: React.CSSProperties }) => {
  if (icon === "youtube") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
};

const URL_PATTERNS: Record<string, RegExp> = {
  youtube: /^https?:\/\/(www\.)?(youtube\.com\/(watch|shorts|live)|youtu\.be\/)/i,
  instagram: /^https?:\/\/(www\.)?instagram\.com\/(p|reel|stories|tv)\//i,
  tiktok: /^https?:\/\/(www\.|vm\.)?tiktok\.com\//i,
};

const COBALT_API = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cobalt-proxy`;

interface PickerItem {
  url: string;
  type?: string;
  thumb?: string;
}

const DownloadInput = ({ platform }: { platform: { icon: string; platform: string; formats: string[] } }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloadMode, setDownloadMode] = useState<"video" | "audio">("video");
  const [quality, setQuality] = useState("720");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadFilename, setDownloadFilename] = useState("");
  const [pickerItems, setPickerItems] = useState<PickerItem[]>([]);

  const handleDownload = async () => {
    const trimmed = url.trim();
    if (!trimmed) { setError("Please paste a URL first"); return; }
    const pattern = URL_PATTERNS[platform.icon];
    if (pattern && !pattern.test(trimmed)) {
      setError(`That doesn't look like a valid ${platform.platform} URL`);
      return;
    }

    setError("");
    setDownloadUrl("");
    setPickerItems([]);
    setLoading(true);

    try {
      const res = await fetch(COBALT_API, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          url: trimmed,
          videoQuality: quality,
          filenameStyle: "classic",
          downloadMode: "default",
          audioFormat: "mp3",
          isAudioOnly: downloadMode === "audio",
        }),
      });

      const data = await res.json();
      console.log('API Response:', data);

      if (data.status === "error") {
        setError(data.text || "The API couldn't process this link.");
        return;
      }

      if (data.status === "picker" && Array.isArray(data.picker)) {
        setPickerItems(data.picker);
      } else if (data.url) {
        setDownloadUrl(data.url);
        setDownloadFilename(data.filename || (downloadMode === "audio" ? "download.mp3" : "download.mp4"));
      } else {
        setError("Unexpected response from the download API.");
      }
    } catch {
      setError("Unable to connect to the download server. Please ensure the local Cobalt service is running.");
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = (href: string, filename?: string) => {
    window.open(href, "_blank");
  };

  return (
    <div className="max-w-lg mx-auto w-full space-y-4">
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setDownloadMode("video")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            downloadMode === "video"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Video className="w-4 h-4" /> Video
        </button>
        <button
          type="button"
          onClick={() => setDownloadMode("audio")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            downloadMode === "audio"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          <Music className="w-4 h-4" /> Audio (MP3)
        </button>
      </div>

      {downloadMode === "video" && (
        <div className="flex justify-center gap-2">
          {["360", "720", "1080"].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(q)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                quality === q
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {q}p
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="url"
            placeholder={`Paste ${platform.platform} URL here...`}
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); setDownloadUrl(""); setPickerItems([]); }}
            className="h-12 pl-10 text-base"
          />
        </div>
        <Button
          onClick={handleDownload}
          size="lg"
          className="h-12 px-5 font-bold gap-2 rounded-xl shrink-0"
          disabled={loading}
        >
          {loading ? (
            <><svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75" /></svg> Processing...</>
          ) : (
            <><Download className="w-5 h-5" /> Download</>
          )}
        </Button>
      </div>

      {error && <p className="text-destructive text-sm text-center">{error}</p>}

      {downloadUrl && !loading && (
        <div className="text-center space-y-2 animate-fade-in">
          <p className="text-sm text-foreground font-medium">✅ Ready! Click below to save your file:</p>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl transition-colors shadow-lg"
          >
            <Download className="w-6 h-6" />
            Download Now
          </a>
          <p className="text-xs text-muted-foreground">{downloadFilename}</p>
        </div>
      )}

      {pickerItems.length > 0 && !loading && (
        <div className="space-y-2 animate-fade-in">
          <p className="text-sm text-foreground font-medium text-center">Multiple files found — pick one:</p>
          <div className="grid gap-2">
            {pickerItems.map((item, i) => (
              <button
                key={i}
                onClick={() => triggerDownload(item.url)}
                className="flex items-center gap-3 w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors text-left"
              >
                <Download className="w-5 h-5 shrink-0" />
                {item.type === "photo" ? `Photo ${i + 1}` : `File ${i + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && !downloadUrl && pickerItems.length === 0 && (
        <p className="text-xs text-muted-foreground text-center">
          Paste your {platform.platform} link and hit Download — fast, free & private
        </p>
      )}
    </div>
  );
};

const DownloaderPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const platform = slug ? getDownloaderBySlug(slug) : undefined;

  if (!platform) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Downloader not found.</p>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${platform.platform} Downloader — Clowd Converter`,
    url: `https://clowdconverter.com/${platform.slug}`,
    description: platform.metaDescription,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: platform.features,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: platform.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Download ${platform.platform} Videos`,
    description: platform.metaDescription,
    totalTime: "PT1M",
    step: platform.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step,
      text: step,
    })),
    tool: { "@type": "HowToTool", name: "Web Browser" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Clowd Converter", item: "https://clowdconverter.com" },
      { "@type": "ListItem", position: 2, name: `${platform.platform} Downloader`, item: `https://clowdconverter.com/${platform.slug}` },
    ],
  };

  const otherPlatforms = DOWNLOADER_PLATFORMS.filter((p) => p.slug !== platform.slug);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{platform.title}</title>
        <meta name="description" content={platform.metaDescription} />
        <link rel="canonical" href={`https://clowdconverter.com/${platform.slug}`} />
        <meta property="og:title" content={platform.title} />
        <meta property="og:description" content={platform.metaDescription} />
        <meta property="og:url" content={`https://clowdconverter.com/${platform.slug}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(howToJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <Header />

      <main className="max-w-5xl mx-auto">
        <nav className="max-w-3xl mx-auto px-4 pt-4 text-xs text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-1">›</span>
          <span className="text-foreground">{platform.platform} Downloader</span>
        </nav>

        <section className="text-center pt-8 pb-6 px-4 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${platform.color}20` }}
            >
              <PlatformIcon icon={platform.icon} className="w-8 h-8" style={{ color: platform.color }} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
            {platform.h1}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-6">
            {platform.description}
          </p>

          {/* URL Input + Download */}
          <DownloadInput platform={platform} />
        </section>

        <AdSlot height="100px" label="Ad Space — Leaderboard" />

        <section className="max-w-3xl mx-auto px-4 py-10">
          <h2 className="text-xl font-bold text-foreground mb-5">
            How to Download {platform.platform} Videos — 3 Easy Steps
          </h2>
          <div className="space-y-4">
            {platform.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-6">
          <h2 className="text-xl font-bold text-foreground mb-5">
            Why Use Our {platform.platform} Downloader?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {platform.features.map((feat, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{feat}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-6">
          <h2 className="text-xl font-bold text-foreground mb-3">
            About the {platform.platform} Downloader
          </h2>
          <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
            {platform.seoContent.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto py-8 px-4">
          <DownloadInput platform={platform} />
        </section>

        <section className="max-w-3xl mx-auto px-4 py-6">
          <h2 className="text-xl font-bold text-foreground mb-5">
            {platform.platform} Downloader — FAQ
          </h2>
          <div className="space-y-4">
            {platform.faq.map((f, i) => (
              <div key={i} className="converter-card p-5">
                <h3 className="font-semibold text-foreground mb-2">{f.q}</h3>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <AdSlot height="90px" label="Ad Space — Banner" />

        <section className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-lg font-bold text-foreground mb-4">More Free Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {otherPlatforms.map((p) => (
              <Link
                key={p.slug}
                to={`/${p.slug}`}
                className="flex items-center gap-2 text-sm text-primary font-medium hover:underline py-1"
              >
                <ArrowRight className="w-4 h-4 shrink-0" />
                {p.platform} Downloader
              </Link>
            ))}
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-primary font-medium hover:underline py-1"
            >
              <ArrowRight className="w-4 h-4 shrink-0" />
              File Converter (MP4, MP3, PNG, etc.)
            </Link>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 pb-8">
          <p className="text-sm text-muted-foreground">
            Check out our{" "}
            <Link to="/blog" className="text-primary hover:underline font-medium">blog and guides</Link>{" "}
            or try our{" "}
            <Link to="/" className="text-primary hover:underline font-medium">free file converter</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DownloaderPage;
