import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { getBlogPostBySlug } from "@/lib/blog-data";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Clowd Marketing" },
    publisher: { "@type": "Organization", name: "Clowd Marketing", logo: { "@type": "ImageObject", url: "https://clowdconverter.com/favicon.png" } },
    url: `https://clowdconverter.com/blog/${post.slug}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://clowdconverter.com/blog/${post.slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Clowd Converter", item: "https://clowdconverter.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://clowdconverter.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://clowdconverter.com/blog/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://clowdconverter.com/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article>
          <h1 className="text-3xl font-extrabold text-foreground mb-3">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>

          <AdSlot height="90px" label="Ad Space — Article Top" />

          <div className="prose prose-sm max-w-none mt-6">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* CTA section for SEO internal linking */}
          <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
            <h3 className="font-bold text-foreground mb-2">Ready to convert your files?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Try Clowd Converter — it's free, fast, and works right in your browser. No uploads, no sign-up required.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
            >
              Start Converting Now →
            </Link>
          </div>

          <AdSlot height="90px" label="Ad Space — Article Bottom" />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
