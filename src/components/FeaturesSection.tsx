import { Zap, Shield, Heart, Globe, Smartphone, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Conversion",
    description: "Convert files in seconds — not minutes. No upload or download wait times. Your file is processed instantly using WebAssembly technology running directly in your browser.",
  },
  {
    icon: Shield,
    title: "100% Private & Secure",
    description: "Your files never leave your device. Unlike other converters that upload to remote servers, Quick Convert Pros processes everything locally. No data collection, no tracking, no cookies.",
  },
  {
    icon: Heart,
    title: "Completely Free — Forever",
    description: "No hidden fees, no premium tiers, no sign-up required. Convert unlimited files with no restrictions. We believe file conversion should be free for everyone.",
  },
  {
    icon: Globe,
    title: "Works Offline",
    description: "Once the page loads, you can convert files without an internet connection. Perfect for travelers, remote workers, or anyone with limited connectivity.",
  },
  {
    icon: Smartphone,
    title: "Any Device, Any Browser",
    description: "Works on iPhone, Android, iPad, Mac, Windows, and Linux. No app download needed — just open your browser and start converting.",
  },
  {
    icon: RefreshCw,
    title: "21+ Conversion Types",
    description: "Convert between video formats (MP4, WebM, MOV, AVI, MKV), audio formats (MP3, WAV, OGG, AAC, FLAC), and image formats (JPG, PNG, WebP, GIF, BMP).",
  },
];

const FeaturesSection = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-foreground text-center mb-2">
        Why Choose Quick Convert Pros?
      </h2>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        The fastest, most private file converter on the web. No uploads, no servers, no compromise.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="converter-card flex flex-col items-start text-left gap-3 p-6"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
