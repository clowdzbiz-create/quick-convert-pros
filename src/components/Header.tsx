import { Cloud, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";

const Header = () => {
  const { theme, setTheme } = useTheme();

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
          <Link to="/youtube-downloader" className="text-muted-foreground hover:text-foreground transition-colors">
            Downloaders
          </Link>
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
