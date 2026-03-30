import { Cloud } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full py-4 px-6">
      <nav aria-label="Main navigation" className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg">Clowd</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
            Converter
          </Link>
          <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
