import { Cloud } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="text-center pt-8 pb-4 animate-fade-in px-4">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Cloud className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
        Free Online File Converter
      </h1>
      <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-2">
        Convert videos, audio, and images instantly — right in your browser. No uploads, no sign-up, 100% free.
      </p>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">
        Supports MP4, MP3, WAV, PNG, JPG, WebP, GIF, and 15+ more formats. Powered by Clowd Converter.
      </p>
    </section>
  );
};

export default HeroSection;
