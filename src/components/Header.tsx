import { Cloud, Sun, Moon, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="w-full py-4 px-6">
      <nav aria-label="Main navigation" className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg">Clowd</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
            Converter
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              Downloaders
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                <Link to="/youtube-downloader" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  YouTube Downloader
                </Link>
                <Link to="/instagram-downloader" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  Instagram Downloader
                </Link>
                <Link to="/tiktok-downloader" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  TikTok Downloader
                </Link>
              </div>
            )}
          </div>
          <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
