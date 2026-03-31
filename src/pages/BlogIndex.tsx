import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-data";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BlogIndex = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = activeCategory === "All"
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === activeCategory);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

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
      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-foreground mb-3">The Clowd Blog</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expert guides, format comparisons, and tutorials to help you convert files smarter.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featuredPost && (
          <Link
            to={`/blog/${featuredPost.slug}`}
            className="group block mb-12 rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow"
          >
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                  width={600}
                  height={400}
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-3">{featuredPost.category}</Badge>
                <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(featuredPost.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Read article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Post grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow flex flex-col"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-44 object-cover"
                loading="lazy"
                width={400}
                height={176}
              />
              <div className="p-5 flex flex-col flex-1">
                <Badge variant="secondary" className="w-fit mb-2 text-xs">{post.category}</Badge>
                <h2 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-3 flex-1 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
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
