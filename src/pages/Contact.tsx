import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MessageSquare } from "lucide-react";

const Contact = () => (
  <>
    <Helmet>
      <title>Contact Us — Quick Convert Pros</title>
      <meta name="description" content="Get in touch with Quick Convert Pros. Contact us for support, feedback, or questions about our free online file converter." />
      <link rel="canonical" href="https://quickconvertpros.com/contact" />
    </Helmet>
    <Header />
    <main className="max-w-3xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-foreground mb-6">Contact Us</h1>

      <div className="space-y-8 text-foreground/90">
        <p className="text-lg leading-relaxed">
          We'd love to hear from you. Whether you have a feature request, found a bug, or just want to say hello — drop us a line.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="mailto:support@quickconvertpros.com"
            className="flex items-start gap-3 p-5 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
          >
            <Mail className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground text-sm">Email Support</h3>
              <p className="text-xs text-muted-foreground mt-1">support@quickconvertpros.com</p>
              <p className="text-xs text-muted-foreground mt-1">We typically respond within 24 hours.</p>
            </div>
          </a>
          <div className="flex items-start gap-3 p-5 rounded-lg border border-border bg-card">
            <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground text-sm">General Inquiries</h3>
              <p className="text-xs text-muted-foreground mt-1">info@quickconvertpros.com</p>
              <p className="text-xs text-muted-foreground mt-1">For partnerships, press, and business.</p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground mb-2">Quick Convert Pros</h2>
          <p className="text-sm text-muted-foreground">
            Quick Convert Pros is a product of Quick Convert Pros.<br />
            We build free, privacy-first tools for everyday needs.
          </p>
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default Contact;
