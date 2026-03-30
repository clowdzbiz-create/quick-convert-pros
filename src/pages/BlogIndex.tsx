import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/blog-data";
import { Calendar, Clock } from "lucide-react";

const BlogIndex = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Clowd Converter Blog",
    url: "https://clowdconverter.com/blog",
    description: "Guides, tips, and tutorials on file conversion — video, audio, and images.",
    publisher: {
      "@type": "Organization",
      name: "Clowd Marketing",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog — Clowd Converter | File Conversion Guides & Tips</title>
        <meta name="description" content="Guides, tips, and tutorials on converting video, audio, and image files. Learn the best formats and methods for every use case." />
        <link rel="canonical" href="https://clowdconverter.com/blog" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Blog</h1>
        <p className="text-muted-foreground mb-8">Guides, tips, and tutorials on file conversion.</p>

        <div className="space-y-5">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="converter-card block p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-bold text-foreground mb-2 hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogIndex;
