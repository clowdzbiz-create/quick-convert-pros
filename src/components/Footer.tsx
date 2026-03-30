import { Link } from "react-router-dom";
import { CONVERSION_ROUTES } from "@/lib/conversion-routes";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border mt-8 bg-card">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h4 className="font-bold text-foreground mb-3">Clowd Converter</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free browser-based file converter. No uploads, no sign-up. Your files never leave your device.
            </p>
          </div>

          {/* Video conversions */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Video Conversions</h4>
            <ul className="space-y-1.5">
              {CONVERSION_ROUTES.filter(r => r.mediaType === "video").map(r => (
                <li key={r.slug}>
                  <Link to={`/${r.slug}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {r.from} → {r.to}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Audio conversions */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Audio Conversions</h4>
            <ul className="space-y-1.5">
              {CONVERSION_ROUTES.filter(r => r.mediaType === "audio").map(r => (
                <li key={r.slug}>
                  <Link to={`/${r.slug}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {r.from} → {r.to}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Image + Resources */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Image Conversions</h4>
            <ul className="space-y-1.5">
              {CONVERSION_ROUTES.filter(r => r.mediaType === "image").map(r => (
                <li key={r.slug}>
                  <Link to={`/${r.slug}`} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    {r.from} → {r.to}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold text-foreground text-sm mt-4 mb-2">Resources</h4>
            <ul className="space-y-1.5">
              <li><Link to="/blog" className="text-xs text-muted-foreground hover:text-primary transition-colors">Blog & Guides</Link></li>
              <li><Link to="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-xs text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Clowd Marketing • Free file conversion • No tracking • Files processed locally</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
