import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONVERSION_ROUTES } from "@/lib/conversion-routes";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Page Not Found — Quick Convert Pros</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-extrabold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          This page doesn't exist. Try one of our popular converters:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto text-left mb-8">
          {CONVERSION_ROUTES.slice(0, 6).map((r) => (
            <Link
              key={r.slug}
              to={`/${r.slug}`}
              className="flex items-center gap-2 text-sm text-primary font-medium hover:underline py-1"
            >
              <ArrowRight className="w-4 h-4 shrink-0" />
              {r.h1}
            </Link>
          ))}
        </div>
        <Link to="/" className="text-primary font-semibold hover:underline">
          ← Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
