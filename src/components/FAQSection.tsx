import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I convert files with Clowd Converter?",
    a: "Simply upload your file, select the target format, and click Convert. Your file will be processed instantly in your browser and ready to download.",
  },
  {
    q: "Is Clowd Converter really free?",
    a: "Yes, Clowd Converter is completely free. No sign-up, no hidden fees. Convert as many files as you want.",
  },
  {
    q: "What file formats does Clowd Converter support?",
    a: "We support video (MP4, WebM, MOV, AVI, MKV, FLV), audio (MP3, WAV, OGG, AAC, FLAC, M4A), and image (JPG, PNG, WebP, GIF, BMP) formats.",
  },
  {
    q: "Is my file secure with Clowd Converter?",
    a: "Yes. Files are processed entirely in your browser — they never leave your device. Nothing is uploaded to any server.",
  },
  {
    q: "What's the maximum file size I can convert?",
    a: "You can convert files up to 500MB in size. For larger files, consider splitting them or using desktop software.",
  },
];

const FAQSection = () => {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-foreground text-center mb-6">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="converter-card px-5 py-1 border">
            <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQSection;
