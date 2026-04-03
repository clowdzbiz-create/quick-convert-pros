import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/blog-data";
import { ArrowLeft, Calendar, Clock, ExternalLink } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Badge } from "@/components/ui/badge";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  // Get related posts (same category, exclude current)
  const relatedPosts = BLOG_POSTS
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    image: post.coverImage,
    author: { "@type": "Organization", name: "Quick Convert Pros" },
    publisher: { "@type": "Organization", name: "Quick Convert Pros", logo: { "@type": "ImageObject", url: "https://quickconvertpros.com/favicon.png" } },
    url: `https://quickconvertpros.com/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://quickconvertpros.com/blog/${post.slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Quick Convert Pros", item: "https://quickconvertpros.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://quickconvertpros.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://quickconvertpros.com/blog/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://quickconvertpros.com/blog/${post.slug}`} />
        <meta property="og:image" content={post.coverImage} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article>
          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-8 border border-border">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 md:h-80 object-cover"
              width={900}
              height={320}
            />
          </div>

          {/* Meta */}
          <div className="mb-6">
            <Badge variant="secondary" className="mb-3">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>

          <AdSlot height="90px" label="Ad Space — Article Top" />

          {/* Content */}
          <div className="prose prose-sm max-w-none mt-6">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Sources */}
          {post.sources && post.sources.length > 0 && (
            <div className="mt-10 p-6 bg-muted/50 rounded-xl border border-border">
              <h3 className="font-bold text-foreground mb-3 text-sm uppercase tracking-wide">Sources & References</h3>
              <ol className="space-y-2">
                {post.sources.map((source, i) => (
                  <li key={i} className="text-sm">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {source.title}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
            <h3 className="font-bold text-foreground mb-2">Ready to convert your files?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Try Quick Convert Pros — it's free, fast, and works right in your browser. No uploads, no sign-up required.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
            >
              Start Converting Now →
            </Link>
          </div>

          <AdSlot height="90px" label="Ad Space — Article Bottom" />

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-foreground mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.slug}
                    to={`/blog/${rp.slug}`}
                    className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-md transition-shadow"
                  >
                    <img
                      src={rp.coverImage}
                      alt={rp.title}
                      className="w-full h-32 object-cover"
                      loading="lazy"
                      width={300}
                      height={128}
                    />
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {rp.title}
                      </h4>
                      <span className="text-xs text-muted-foreground mt-1 block">{rp.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
