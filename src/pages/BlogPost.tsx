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
    publisher: { "@type": "Organization", name: "Clowd Marketing" },
    url: `https://clowdconverter.com/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://clowdconverter.com/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
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

          <AdSlot height="90px" label="Ad Space — Article Bottom" />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
