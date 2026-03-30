import { Cloud } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="text-center pt-8 pb-4 animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Cloud className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
        Clowd Converter
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mx-auto">
        Convert videos, audio, and images instantly. Free, fast, and secure.
      </p>
    </section>
  );
};

export default HeroSection;
