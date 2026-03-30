import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => (
  <>
    <Helmet>
      <title>Terms of Service — Clowd Converter</title>
      <meta name="description" content="Terms of Service for Clowd Converter. Read the terms and conditions for using our free online file converter." />
      <link rel="canonical" href="https://clowdconverter.com/terms-of-service" />
    </Helmet>
    <Header />
    <main className="max-w-3xl mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: March 30, 2026</p>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-foreground/90">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing and using Clowd Converter ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
          <p>Clowd Converter is a free, browser-based file conversion tool that allows you to convert video, audio, and image files. All conversions are processed locally in your browser — no files are uploaded to our servers.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Use of the Service</h2>
          <p>You agree to use the Service only for lawful purposes. You must not:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the Service to convert files you do not have the right to convert.</li>
            <li>Attempt to interfere with or disrupt the Service.</li>
            <li>Use automated tools to access the Service in a way that impacts performance for others.</li>
            <li>Use the Service for any illegal or unauthorised purpose.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Intellectual Property</h2>
          <p>You retain all rights to the files you convert. Clowd Converter does not claim any ownership over your files. The Service itself, including its design, code, and content, is owned by Clowd Marketing.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Disclaimer of Warranties</h2>
          <p>The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or that conversion results will meet your specific requirements.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Clowd Marketing shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Advertising</h2>
          <p>The Service is supported by advertising through Google AdSense. By using the Service, you acknowledge that ads will be displayed during your use.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:support@clowdconverter.com" className="text-primary hover:underline">support@clowdconverter.com</a>.</p>
        </section>
      </div>
    </main>
    <Footer />
  </>
);

export default TermsOfService;
