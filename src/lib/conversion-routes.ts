// Conversion route data for SEO landing pages
export interface ConversionRoute {
  slug: string;
  from: string;
  to: string;
  fromExt: string;
  toExt: string;
  mediaType: "video" | "audio" | "image";
  title: string;
  metaDescription: string;
  h1: string;
  description: string;
  steps: string[];
  faq: { q: string; a: string }[];
}

export const CONVERSION_ROUTES: ConversionRoute[] = [
  {
    slug: "convert-mp4-to-mp3",
    from: "MP4", to: "MP3", fromExt: "mp4", toExt: "mp3",
    mediaType: "video",
    title: "Convert MP4 to MP3 Online Free — Clowd Converter",
    metaDescription: "Convert MP4 video to MP3 audio instantly for free. No upload needed — files are processed in your browser. Fast, private, and secure.",
    h1: "Convert MP4 to MP3",
    description: "Extract audio from any MP4 video file and save it as MP3. Perfect for saving music, podcasts, or audio from video recordings. Everything runs in your browser — your files never leave your device.",
    steps: ["Upload your MP4 video file", "MP3 format is auto-selected", "Click Convert and download your MP3"],
    faq: [
      { q: "Does converting MP4 to MP3 lose quality?", a: "The audio quality depends on the original MP4 file. Our converter preserves the original audio bitrate for the best possible MP3 output." },
      { q: "How long does MP4 to MP3 conversion take?", a: "Most files convert in under 30 seconds. Larger files may take a bit longer since everything is processed locally in your browser." },
      { q: "Can I convert MP4 to MP3 on mobile?", a: "Yes! Clowd Converter works on any device with a modern browser — phones, tablets, and desktops." },
    ],
  },
  {
    slug: "convert-video-to-mp3",
    from: "Video", to: "MP3", fromExt: "video", toExt: "mp3",
    mediaType: "video",
    title: "Convert Video to MP3 Online Free — Clowd Converter",
    metaDescription: "Extract MP3 audio from any video file for free. Supports MP4, WebM, MOV, AVI, MKV. No sign-up, processed in your browser.",
    h1: "Convert Video to MP3",
    description: "Extract MP3 audio from any video format — MP4, WebM, MOV, AVI, MKV, and more. Ideal for saving music, lectures, or podcasts from video files.",
    steps: ["Upload any video file", "MP3 is selected as output", "Click Convert and download"],
    faq: [
      { q: "What video formats can I convert to MP3?", a: "We support MP4, WebM, MOV, AVI, MKV, FLV, and most other common video formats." },
      { q: "Is there a file size limit?", a: "You can convert files up to 500MB. For larger files, consider using desktop software." },
    ],
  },
  {
    slug: "convert-webm-to-mp4",
    from: "WebM", to: "MP4", fromExt: "webm", toExt: "mp4",
    mediaType: "video",
    title: "Convert WebM to MP4 Online Free — Clowd Converter",
    metaDescription: "Convert WebM videos to MP4 format instantly. Free, no upload — browser-based conversion. Compatible with all devices.",
    h1: "Convert WebM to MP4",
    description: "Convert WebM videos to the universally compatible MP4 format. Great for sharing videos that were recorded in WebM on platforms that require MP4.",
    steps: ["Upload your WebM file", "Select MP4 as output format", "Click Convert and download your MP4"],
    faq: [
      { q: "Why convert WebM to MP4?", a: "MP4 is the most widely supported video format across all devices, social media platforms, and video players. WebM may not play on some older devices." },
      { q: "Does conversion reduce video quality?", a: "Our converter maintains the original video quality during conversion. The output MP4 will look the same as your WebM source." },
    ],
  },
  {
    slug: "convert-png-to-jpg",
    from: "PNG", to: "JPG", fromExt: "png", toExt: "jpg",
    mediaType: "image",
    title: "Convert PNG to JPG Online Free — Clowd Converter",
    metaDescription: "Convert PNG images to JPG format instantly. Reduce file size while maintaining quality. Free, no upload — processed in your browser.",
    h1: "Convert PNG to JPG",
    description: "Convert PNG images to JPG to reduce file size for web use, email attachments, or social media. JPG compression can dramatically reduce file sizes while maintaining visual quality.",
    steps: ["Upload your PNG image", "JPG format is auto-selected", "Click Convert and download your JPG"],
    faq: [
      { q: "Does PNG to JPG conversion lose quality?", a: "JPG uses lossy compression, so there is a slight quality reduction. However, our converter uses 92% quality which is virtually indistinguishable from the original." },
      { q: "Why convert PNG to JPG?", a: "JPG files are typically 50-80% smaller than PNG files, making them ideal for web pages, emails, and social media where file size matters." },
    ],
  },
  {
    slug: "convert-jpg-to-png",
    from: "JPG", to: "PNG", fromExt: "jpg", toExt: "png",
    mediaType: "image",
    title: "Convert JPG to PNG Online Free — Clowd Converter",
    metaDescription: "Convert JPG images to PNG format for transparency support and lossless quality. Free, no sign-up, processed in your browser.",
    h1: "Convert JPG to PNG",
    description: "Convert JPG images to PNG format for transparency support, lossless quality, or web compatibility. PNG is ideal when you need sharp edges, text overlays, or transparent backgrounds.",
    steps: ["Upload your JPG image", "PNG is selected as output", "Click Convert and download your PNG"],
    faq: [
      { q: "Why convert JPG to PNG?", a: "PNG supports transparency and lossless compression, making it ideal for logos, graphics with text, screenshots, and images that need transparent backgrounds." },
      { q: "Will the file be larger?", a: "Yes, PNG files are typically larger than JPG because PNG uses lossless compression. This is the trade-off for better quality and transparency support." },
    ],
  },
  {
    slug: "convert-mp3-to-wav",
    from: "MP3", to: "WAV", fromExt: "mp3", toExt: "wav",
    mediaType: "audio",
    title: "Convert MP3 to WAV Online Free — Clowd Converter",
    metaDescription: "Convert MP3 audio to WAV format for lossless quality. Free, no upload — browser-based conversion. Perfect for audio editing.",
    h1: "Convert MP3 to WAV",
    description: "Convert MP3 files to WAV format for audio editing, professional use, or compatibility with software that requires uncompressed audio.",
    steps: ["Upload your MP3 file", "WAV format is auto-selected", "Click Convert and download your WAV"],
    faq: [
      { q: "Why convert MP3 to WAV?", a: "WAV is an uncompressed audio format preferred by audio editors, musicians, and professional software. It provides the highest compatibility for editing." },
      { q: "Will the WAV file be much larger?", a: "Yes, WAV files are significantly larger than MP3 because they're uncompressed. A 5MB MP3 could become a 50MB WAV file." },
    ],
  },
  {
    slug: "convert-mov-to-mp4",
    from: "MOV", to: "MP4", fromExt: "mov", toExt: "mp4",
    mediaType: "video",
    title: "Convert MOV to MP4 Online Free — Clowd Converter",
    metaDescription: "Convert MOV videos from iPhone or Mac to MP4 format. Free, instant, browser-based. No software download needed.",
    h1: "Convert MOV to MP4",
    description: "Convert Apple MOV videos to the universally compatible MP4 format. Perfect for iPhone recordings, QuickTime exports, and Mac video files that need to work everywhere.",
    steps: ["Upload your MOV file", "MP4 is selected as output", "Click Convert and download"],
    faq: [
      { q: "Why convert MOV to MP4?", a: "MOV is Apple's format and may not play on Windows, Android, or some web platforms. MP4 is universally supported across all devices and platforms." },
      { q: "Can I convert iPhone videos?", a: "Yes! iPhone records in MOV format by default. Upload your iPhone videos and convert them to MP4 for easy sharing." },
    ],
  },
  {
    slug: "convert-wav-to-mp3",
    from: "WAV", to: "MP3", fromExt: "wav", toExt: "mp3",
    mediaType: "audio",
    title: "Convert WAV to MP3 Online Free — Clowd Converter",
    metaDescription: "Convert WAV audio to MP3 to reduce file size. Free, instant, browser-based. No quality loss you can hear.",
    h1: "Convert WAV to MP3",
    description: "Compress WAV audio files to MP3 format to reduce file size by up to 90% while maintaining excellent audio quality.",
    steps: ["Upload your WAV file", "MP3 is selected as output", "Click Convert and download"],
    faq: [
      { q: "How much smaller will my MP3 be?", a: "MP3 files are typically 5-10x smaller than the equivalent WAV. A 50MB WAV might become a 5MB MP3." },
      { q: "Will I hear a difference?", a: "For most listeners, the difference between a high-quality MP3 and WAV is imperceptible, especially for speech and most music." },
    ],
  },
  {
    slug: "convert-png-to-webp",
    from: "PNG", to: "WebP", fromExt: "png", toExt: "webp",
    mediaType: "image",
    title: "Convert PNG to WebP Online Free — Clowd Converter",
    metaDescription: "Convert PNG images to WebP for smaller file sizes with transparency. Free, browser-based. Perfect for web optimization.",
    h1: "Convert PNG to WebP",
    description: "Convert PNG images to Google's WebP format for dramatically smaller file sizes while preserving transparency. WebP is the modern standard for web images.",
    steps: ["Upload your PNG image", "Select WebP as output", "Click Convert and download"],
    faq: [
      { q: "What are the benefits of WebP?", a: "WebP images are 25-35% smaller than PNG at equivalent quality, while still supporting transparency. This means faster loading websites." },
      { q: "Do all browsers support WebP?", a: "Yes, all modern browsers (Chrome, Firefox, Safari, Edge) support WebP. Only very old browsers lack support." },
    ],
  },
  {
    slug: "convert-mp4-to-webm",
    from: "MP4", to: "WebM", fromExt: "mp4", toExt: "webm",
    mediaType: "video",
    title: "Convert MP4 to WebM Online Free — Clowd Converter",
    metaDescription: "Convert MP4 videos to WebM for web embedding. Free, instant, no upload — processed in your browser.",
    h1: "Convert MP4 to WebM",
    description: "Convert MP4 videos to WebM format, the open web standard for HTML5 video. Ideal for embedding videos on websites with smaller file sizes.",
    steps: ["Upload your MP4 video", "Select WebM as output", "Click Convert and download"],
    faq: [
      { q: "Why use WebM instead of MP4?", a: "WebM is an open format that often produces smaller files for web use. It's natively supported by Chrome, Firefox, and Edge." },
      { q: "Can I embed WebM in HTML?", a: "Yes, WebM works with the HTML5 <video> tag in all modern browsers." },
    ],
  },
  // Additional long-tail conversions
  {
    slug: "convert-jpg-to-webp",
    from: "JPG", to: "WebP", fromExt: "jpg", toExt: "webp",
    mediaType: "image",
    title: "Convert JPG to WebP Online Free — Clowd Converter",
    metaDescription: "Convert JPG images to WebP for 30% smaller file sizes. Free, instant, browser-based. Optimize images for web performance.",
    h1: "Convert JPG to WebP",
    description: "Convert JPG images to WebP format for significantly smaller file sizes without visible quality loss. WebP is recommended by Google for faster web pages and better Core Web Vitals.",
    steps: ["Upload your JPG image", "Select WebP as output format", "Click Convert and download your WebP image"],
    faq: [
      { q: "How much smaller is WebP vs JPG?", a: "WebP images are typically 25-34% smaller than equivalent JPEG images at the same visual quality, according to Google's own benchmarks." },
      { q: "Should I use WebP on my website?", a: "Yes! WebP is supported by all modern browsers and is recommended by Google for better page speed scores and SEO rankings." },
    ],
  },
  {
    slug: "convert-webp-to-jpg",
    from: "WebP", to: "JPG", fromExt: "webp", toExt: "jpg",
    mediaType: "image",
    title: "Convert WebP to JPG Online Free — Clowd Converter",
    metaDescription: "Convert WebP images to JPG for maximum compatibility. Free, browser-based. No upload needed.",
    h1: "Convert WebP to JPG",
    description: "Convert WebP images to the universally compatible JPG format. Useful when you need to share images with apps or services that don't support WebP yet.",
    steps: ["Upload your WebP image", "JPG is auto-selected as output", "Click Convert and download"],
    faq: [
      { q: "Why convert WebP to JPG?", a: "While WebP is widely supported in browsers, some older apps, email clients, and social platforms may not display WebP images. JPG is universally compatible." },
      { q: "Does it lose quality?", a: "Our converter uses 92% quality setting which produces virtually identical results to the original with minimal file size increase." },
    ],
  },
  {
    slug: "convert-webp-to-png",
    from: "WebP", to: "PNG", fromExt: "webp", toExt: "png",
    mediaType: "image",
    title: "Convert WebP to PNG Online Free — Clowd Converter",
    metaDescription: "Convert WebP images to PNG for lossless quality and transparency. Free, instant, processed in your browser.",
    h1: "Convert WebP to PNG",
    description: "Convert WebP images to PNG format for lossless quality, transparency support, and compatibility with image editors that don't support WebP.",
    steps: ["Upload your WebP image", "PNG is selected as output", "Click Convert and download your PNG"],
    faq: [
      { q: "Will converting WebP to PNG increase file size?", a: "Yes, PNG files are typically larger because PNG uses lossless compression. However, you get perfect quality and full transparency support." },
      { q: "When should I use PNG over WebP?", a: "Use PNG when you need to edit the image in software that doesn't support WebP, or when you need guaranteed lossless quality." },
    ],
  },
  {
    slug: "convert-mp4-to-mov",
    from: "MP4", to: "MOV", fromExt: "mp4", toExt: "mov",
    mediaType: "video",
    title: "Convert MP4 to MOV Online Free — Clowd Converter",
    metaDescription: "Convert MP4 videos to MOV format for Apple devices. Free, instant, browser-based. Perfect for iMovie and Final Cut Pro.",
    h1: "Convert MP4 to MOV",
    description: "Convert MP4 video files to Apple's MOV format. Ideal for importing into iMovie, Final Cut Pro, or other Apple-native video editing software.",
    steps: ["Upload your MP4 video file", "Select MOV as output format", "Click Convert and download your MOV file"],
    faq: [
      { q: "Why would I need MOV format?", a: "MOV is Apple's native format and works best with iMovie, Final Cut Pro, and other Apple software. Some Apple workflows require MOV files." },
      { q: "Is there quality loss?", a: "No, the conversion preserves your original video and audio quality." },
    ],
  },
  {
    slug: "convert-avi-to-mp4",
    from: "AVI", to: "MP4", fromExt: "avi", toExt: "mp4",
    mediaType: "video",
    title: "Convert AVI to MP4 Online Free — Clowd Converter",
    metaDescription: "Convert AVI videos to MP4 for smaller file sizes and universal compatibility. Free, browser-based. No software needed.",
    h1: "Convert AVI to MP4",
    description: "Convert large AVI video files to the modern MP4 format. MP4 offers much smaller file sizes with the same visual quality, and is compatible with every device and platform.",
    steps: ["Upload your AVI video file", "MP4 is selected as output", "Click Convert and download your MP4"],
    faq: [
      { q: "Why convert AVI to MP4?", a: "AVI files are typically very large and use outdated codecs. MP4 uses modern compression (H.264) that produces files 5-10x smaller with the same quality." },
      { q: "Can I share MP4 on social media?", a: "Yes! MP4 is the standard format accepted by YouTube, Instagram, TikTok, Facebook, Twitter, and all other social platforms." },
    ],
  },
  {
    slug: "convert-mkv-to-mp4",
    from: "MKV", to: "MP4", fromExt: "mkv", toExt: "mp4",
    mediaType: "video",
    title: "Convert MKV to MP4 Online Free — Clowd Converter",
    metaDescription: "Convert MKV videos to MP4 for universal device compatibility. Free, instant, no upload required.",
    h1: "Convert MKV to MP4",
    description: "Convert MKV video files to the widely compatible MP4 format. Many devices and apps don't support MKV, but MP4 works everywhere — phones, tablets, TVs, and web browsers.",
    steps: ["Upload your MKV video", "MP4 is selected as output format", "Click Convert and download"],
    faq: [
      { q: "Why doesn't my device play MKV?", a: "MKV is a container format that many devices and apps don't natively support. MP4 is universally compatible with phones, tablets, smart TVs, and all video players." },
      { q: "Does converting MKV to MP4 lose subtitles?", a: "The basic conversion preserves video and audio. Embedded subtitles may need to be added separately after conversion." },
    ],
  },
  {
    slug: "convert-flac-to-mp3",
    from: "FLAC", to: "MP3", fromExt: "flac", toExt: "mp3",
    mediaType: "audio",
    title: "Convert FLAC to MP3 Online Free — Clowd Converter",
    metaDescription: "Convert FLAC audio to MP3 for smaller file sizes and universal compatibility. Free, browser-based conversion.",
    h1: "Convert FLAC to MP3",
    description: "Convert lossless FLAC audio files to MP3 format. Reduce file sizes by up to 80% while keeping great sound quality. Perfect for portable music players and phone storage.",
    steps: ["Upload your FLAC audio file", "MP3 is selected as output", "Click Convert and download"],
    faq: [
      { q: "How much smaller is MP3 vs FLAC?", a: "An MP3 file is typically 70-80% smaller than the same FLAC file. A 40MB FLAC song becomes roughly an 8MB MP3." },
      { q: "Is there a noticeable quality difference?", a: "For most listeners on standard speakers or earbuds, the difference is imperceptible. Audiophiles with high-end equipment may notice subtle differences." },
    ],
  },
  {
    slug: "convert-ogg-to-mp3",
    from: "OGG", to: "MP3", fromExt: "ogg", toExt: "mp3",
    mediaType: "audio",
    title: "Convert OGG to MP3 Online Free — Clowd Converter",
    metaDescription: "Convert OGG Vorbis audio to MP3 for universal playback. Free, instant, browser-based. No software needed.",
    h1: "Convert OGG to MP3",
    description: "Convert OGG Vorbis audio files to the universally compatible MP3 format. OGG is common in games and open-source software, but MP3 works with every device and music player.",
    steps: ["Upload your OGG audio file", "MP3 is selected as output format", "Click Convert and download your MP3"],
    faq: [
      { q: "What is OGG format?", a: "OGG (Vorbis) is an open-source audio format commonly used in games, Linux systems, and web applications. It offers good quality but isn't supported by all players." },
      { q: "Is OGG or MP3 better quality?", a: "At similar bitrates, OGG Vorbis can sound slightly better than MP3. However, MP3 has universal compatibility which is why many people prefer to convert." },
    ],
  },
  {
    slug: "convert-aac-to-mp3",
    from: "AAC", to: "MP3", fromExt: "aac", toExt: "mp3",
    mediaType: "audio",
    title: "Convert AAC to MP3 Online Free — Clowd Converter",
    metaDescription: "Convert AAC audio files to MP3 for wider device compatibility. Free, instant, processed in your browser.",
    h1: "Convert AAC to MP3",
    description: "Convert AAC audio files to MP3 format. AAC is common in iTunes and Apple Music downloads, but MP3 has broader compatibility with all devices and music players.",
    steps: ["Upload your AAC audio file", "MP3 is selected as output", "Click Convert and download your MP3"],
    faq: [
      { q: "What's the difference between AAC and MP3?", a: "AAC generally offers better audio quality at the same bitrate as MP3. However, MP3 is more universally supported across devices and software." },
      { q: "Will my iTunes music work after conversion?", a: "If your AAC files are DRM-free (purchased from iTunes after 2009), yes they will convert perfectly to MP3." },
    ],
  },
  {
    slug: "convert-gif-to-png",
    from: "GIF", to: "PNG", fromExt: "gif", toExt: "png",
    mediaType: "image",
    title: "Convert GIF to PNG Online Free — Clowd Converter",
    metaDescription: "Convert GIF images to PNG for better quality and transparency. Free, instant, browser-based conversion.",
    h1: "Convert GIF to PNG",
    description: "Convert GIF images to PNG format for higher quality, better color depth, and proper transparency support. PNG offers superior image quality compared to the 256-color GIF format.",
    steps: ["Upload your GIF image", "PNG is auto-selected as output", "Click Convert and download your PNG"],
    faq: [
      { q: "Why convert GIF to PNG?", a: "GIF is limited to 256 colors and uses basic transparency. PNG supports millions of colors and alpha transparency for much better image quality." },
      { q: "What about animated GIFs?", a: "This converter extracts the first frame of an animated GIF. For full animation conversion, you'll need a specialized tool." },
    ],
  },
  {
    slug: "convert-bmp-to-jpg",
    from: "BMP", to: "JPG", fromExt: "bmp", toExt: "jpg",
    mediaType: "image",
    title: "Convert BMP to JPG Online Free — Clowd Converter",
    metaDescription: "Convert BMP images to JPG for dramatically smaller file sizes. Free, browser-based. Reduce image size by 90%+.",
    h1: "Convert BMP to JPG",
    description: "Convert uncompressed BMP images to JPG to massively reduce file sizes. BMP files can be 10-50x larger than the equivalent JPG. Perfect for scanning outputs and legacy image files.",
    steps: ["Upload your BMP image", "JPG is selected as output format", "Click Convert and download your compressed JPG"],
    faq: [
      { q: "How much smaller is JPG vs BMP?", a: "JPG files are typically 90-95% smaller than BMP. A 10MB BMP screenshot might become just 500KB as a JPG." },
      { q: "What is BMP used for?", a: "BMP (Bitmap) is an uncompressed image format common in Windows screenshots, older scanners, and legacy applications. It's rarely used on the web due to huge file sizes." },
    ],
  },
];

export function getConversionBySlug(slug: string): ConversionRoute | undefined {
  return CONVERSION_ROUTES.find((r) => r.slug === slug);
}
