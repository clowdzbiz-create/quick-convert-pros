import { ArrowRight } from "lucide-react";

const conversions = [
  "MP4 to MP3",
  "Video to MP3",
  "WebM to MP4",
  "PNG to JPG",
  "JPG to PNG",
  "MP3 to WAV",
];

const PopularConversions = () => {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8">
      <h3 className="text-lg font-bold text-foreground mb-4">Popular Conversions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {conversions.map((c) => (
          <button
            key={c}
            className="flex items-center gap-2 text-sm text-primary font-medium hover:underline text-left py-1"
          >
            <ArrowRight className="w-4 h-4 shrink-0" />
            Convert {c}
          </button>
        ))}
      </div>
    </section>
  );
};

export default PopularConversions;
