import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => (
  <>
    <Helmet>
      <title>Privacy Policy — Clowd Converter</title>
      <meta name="description" content="Privacy Policy for Clowd Converter. Learn how we handle your data — spoiler: your files never leave your browser." />
      <link rel="canonical" href="https://clowdconverter.com/privacy-policy" />
    </Helmet>
    <Header />
    <main className="max-w-3xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 30, 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-foreground/90">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
          <p>Clowd Converter ("we", "us", "our") is operated by Clowd Converter. This Privacy Policy explains how we collect, use, and protect information when you use our website at clowdconverter.com (the "Service").</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Files You Convert</h2>
          <p>All file conversions are processed <strong>entirely in your browser</strong> using client-side technology (FFmpeg.wasm and the Canvas API). Your files are <strong>never uploaded</strong> to our servers. We have no access to the files you convert, and no file data is stored, transmitted, or logged.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Information We Collect</h2>
          <p>We do not require you to create an account or provide any personal information to use the converter. We may collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Usage data:</strong> Anonymous page views and general usage statistics to improve the Service.</li>
            <li><strong>Cookies:</strong> We use essential cookies for site functionality. Third-party advertising partners (Google AdSense) may use cookies to serve relevant ads.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Google AdSense & Advertising</h2>
          <p>We use Google AdSense to display advertisements. Google may use cookies and web beacons to serve ads based on your prior visits to our site and other websites. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
          <p>For more information on how Google uses data, please visit <a href="https://policies.google.com/technologies/partner-sites" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google's Privacy & Terms</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Third-Party Services</h2>
          <p>Our Service may contain links to third-party websites. We are not responsible for the privacy practices of these sites. We encourage you to read the privacy policies of any third-party site you visit.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Data Security</h2>
          <p>Since files are processed locally in your browser, they are never transmitted over the internet. This provides the highest level of privacy and security for your files.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Children's Privacy</h2>
          <p>Our Service is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@clowdconverter.com" className="text-primary hover:underline">support@clowdconverter.com</a>.</p>
        </section>
      </div>
    </main>
    <Footer />
  </>
);

export default PrivacyPolicy;
