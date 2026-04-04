import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Zap, Lock, Globe } from "lucide-react";

const About = () => (
  <>
    <Helmet>
      <title>About Clowd Converter — Free Browser-Based File Converter</title>
      <meta name="description" content="Learn about Clowd Converter — a free, private, browser-based file converter for video, audio, and images. No uploads, no sign-up required." />
      <link rel="canonical" href="https://clowdconverter.com/about" />
    </Helmet>
    <Header />
    <main className="max-w-3xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-foreground mb-6">About Clowd Converter</h1>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-foreground/90">
        <p className="text-lg leading-relaxed">
          Clowd Converter is a <strong>free online file converter</strong> built by Clowd Converter. We believe file conversion should be fast, free, and private — so we built a tool that processes everything right in your browser.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-8">
          {[
            { icon: Lock, title: "100% Private", desc: "Files never leave your device. No uploads, no servers." },
            { icon: Zap, title: "Instant Conversion", desc: "Powered by FFmpeg.wasm for fast, reliable results." },
            { icon: Shield, title: "No Sign-Up", desc: "No accounts, no email, no personal data collected." },
            { icon: Globe, title: "Works Everywhere", desc: "Runs in any modern browser on desktop or mobile." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-4 rounded-lg border border-border bg-card">
              <Icon className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-semibold text-foreground text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="text-xl font-semibold text-foreground">What We Convert</h2>
          <p>Clowd Converter supports a wide range of formats across three categories:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Video:</strong> MP4, WebM, AVI, MOV, MKV, GIF, and more</li>
            <li><strong>Audio:</strong> MP3, WAV, AAC, OGG, FLAC, M4A, and more</li>
            <li><strong>Images:</strong> PNG, JPG, WebP, BMP, TIFF, ICO, AVIF, and more</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
          <p>Too many file converters require uploads to unknown servers, demand sign-ups, or charge for basic conversions. We built Clowd Converter to be different — a genuinely free tool that respects your privacy and just works.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
          <p>Have a question, suggestion, or issue? Reach us at <a href="mailto:support@clowdconverter.com" className="text-primary hover:underline">support@clowdconverter.com</a>.</p>
          <p className="mt-2">
            Check out our <Link to="/blog" className="text-primary hover:underline">blog</Link> for guides and tips on file conversion.
          </p>
        </section>
      </div>
    </main>
    <Footer />
  </>
);

export default About;
