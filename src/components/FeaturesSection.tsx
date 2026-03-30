import { Zap, Shield, Heart } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Convert files in seconds",
  },
  {
    icon: Shield,
    title: "Secure",
    description: "Files processed locally in your browser",
  },
  {
    icon: Heart,
    title: "Free Forever",
    description: "No sign-up required",
  },
];

const FeaturesSection = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="converter-card flex flex-col items-center text-center gap-3 py-8"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
