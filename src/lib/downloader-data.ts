export interface DownloaderPlatform {
  slug: string;
  platform: string;
  title: string;
  metaDescription: string;
  h1: string;
  description: string;
  cobaltUrl: string;
  formats: string[];
  icon: "youtube" | "instagram" | "tiktok";
  color: string;
  steps: string[];
  features: string[];
  faq: { q: string; a: string }[];
  seoContent: string[];
}

export const DOWNLOADER_PLATFORMS: DownloaderPlatform[] = [
  {
    slug: "youtube-downloader",
    platform: "YouTube",
    title: "YouTube Downloader — Download YouTube Videos as MP3 & MP4 Free | Clowd",
    metaDescription:
      "Download YouTube videos as MP4 or extract audio as MP3 for free. No software needed — works on any device. Fast, safe, and unlimited.",
    h1: "YouTube Video Downloader",
    description:
      "Download any YouTube video as MP4 or extract the audio as MP3. Free, fast, and works on every device.",
    cobaltUrl: "https://cobalt.tools",
    formats: ["MP4 (Video)", "MP3 (Audio)", "WAV", "OGG"],
    icon: "youtube",
    color: "hsl(0, 100%, 50%)",
    steps: [
      "Paste the YouTube video URL into the field on this page.",
      "Click Copy URL to save the link to your clipboard instantly.",
      "Open cobalt.tools in a new tab, paste the link, choose MP3 or MP4, and download.",
    ],
    features: [
      "Download full YouTube videos in MP4 up to 4K quality",
      "Extract audio from any YouTube video as high-quality MP3",
      "No software installation or account required",
      "Works on iPhone, Android, Windows, Mac, and Linux",
      "No ads, no popups, completely free",
      "Supports playlists and long-form videos",
    ],
    faq: [
      {
        q: "Is it free to download YouTube videos?",
        a: "Yes, the downloader is completely free to use. There are no hidden fees, subscriptions, or limits on the number of downloads.",
      },
      {
        q: "Can I download YouTube videos as MP3?",
        a: "Absolutely. You can extract just the audio from any YouTube video and save it as a high-quality MP3 file — perfect for music, podcasts, and lectures.",
      },
      {
        q: "Does this work on my phone?",
        a: "Yes. The downloader works in any modern web browser on iPhone, Android, tablets, and desktop computers. No app installation needed.",
      },
      {
        q: "What video quality can I download?",
        a: "You can download YouTube videos in various qualities from 360p up to 4K (2160p), depending on the original video's available resolutions.",
      },
      {
        q: "Is it safe to use?",
        a: "Yes. We redirect you to cobalt.tools, an open-source, ad-free downloader trusted by millions. Your data stays private and no personal information is collected.",
      },
    ],
    seoContent: [
      "Looking for a reliable YouTube video downloader? Clowd makes it simple to save any YouTube video to your device as an MP4 video file or MP3 audio file. Whether you want to watch videos offline during a flight, save a lecture for studying, or keep a music video for your collection — we've got you covered.",
      "Unlike many YouTube downloaders filled with ads and malware, we partner with cobalt.tools — a trusted, open-source platform that respects your privacy. No shady redirects, no fake download buttons, no adware bundled with your files.",
      "Our YouTube downloader supports all video lengths and resolutions. Download short clips, full movies, music videos, tutorials, podcasts, and livestream recordings. Audio extraction produces high-quality MP3 files at up to 320kbps bitrate.",
    ],
  },
  {
    slug: "instagram-downloader",
    platform: "Instagram",
    title: "Instagram Downloader — Save Reels, Stories & Posts Free | Clowd",
    metaDescription:
      "Download Instagram Reels, Stories, and posts as MP4 or photos. Free, fast, no login required. Save any Instagram content to your device.",
    h1: "Instagram Video & Photo Downloader",
    description:
      "Save Instagram Reels, Stories, and posts to your device. Download videos as MP4 or save photos in full quality.",
    cobaltUrl: "https://cobalt.tools",
    formats: ["MP4 (Reels/Stories)", "JPG (Photos)", "MP3 (Audio)"],
    icon: "instagram",
    color: "hsl(330, 80%, 55%)",
    steps: [
      "Paste the Instagram post, Reel, or Story link into the field on this page.",
      "Click Copy URL to save it to your clipboard.",
      "Open cobalt.tools in a new tab, paste the Instagram URL, and download your media.",
    ],
    features: [
      "Download Instagram Reels as MP4 video files",
      "Save Instagram Stories before they disappear",
      "Download photos from posts and carousels in full resolution",
      "No Instagram login required",
      "Works on all devices — phone, tablet, and desktop",
      "Free and unlimited downloads",
    ],
    faq: [
      {
        q: "Can I download Instagram Reels?",
        a: "Yes. Simply copy the Reel's link from Instagram, paste it into the downloader, and save it as an MP4 video file to your device.",
      },
      {
        q: "Do I need to log in to my Instagram account?",
        a: "No. The downloader works without any login. Just copy the URL of the public post, Reel, or Story you want to save.",
      },
      {
        q: "Can I download Instagram Stories?",
        a: "Yes, you can download Stories from public accounts. Copy the Story link and paste it into the downloader to save it before it expires.",
      },
      {
        q: "What quality are the downloaded files?",
        a: "Videos and photos are downloaded in the highest quality available from Instagram — the same resolution as the original upload.",
      },
      {
        q: "Is this safe to use?",
        a: "Yes. We use cobalt.tools, a reputable open-source tool with no ads, trackers, or malware. Your privacy is fully protected.",
      },
    ],
    seoContent: [
      "Need to save an Instagram Reel, Story, or post? Clowd's Instagram downloader lets you download any public Instagram content directly to your device. Whether it's a viral Reel you want to share, a Story that's about to expire, or a stunning photo you want to keep — downloading takes just seconds.",
      "Instagram doesn't offer a built-in download option for other people's content, but our tool bridges that gap. Simply grab the link, paste it in, and save. It works for Reels, Stories, single photos, carousel posts, and IGTV videos.",
      "We use cobalt.tools — an open-source, privacy-focused downloader with zero ads and no tracking. Unlike sketchy Instagram saver apps, there's nothing to install and no risk of malware.",
    ],
  },
  {
    slug: "tiktok-downloader",
    platform: "TikTok",
    title: "TikTok Downloader — Save TikTok Videos Without Watermark Free | Clowd",
    metaDescription:
      "Download TikTok videos without watermark as MP4. Free, fast, no app needed. Save any TikTok to your device in full HD quality.",
    h1: "TikTok Video Downloader",
    description:
      "Download TikTok videos without the watermark. Save any TikTok as a clean MP4 file — free and instant.",
    cobaltUrl: "https://cobalt.tools",
    formats: ["MP4 (No Watermark)", "MP3 (Audio Only)", "MP4 (With Watermark)"],
    icon: "tiktok",
    color: "hsl(180, 100%, 40%)",
    steps: [
      "Paste the TikTok video URL into the field on this page.",
      "Click Copy URL to save it to your clipboard.",
      "Open cobalt.tools in a new tab, paste the TikTok URL, and download your video.",
    ],
    features: [
      "Download TikTok videos without the watermark",
      "Save TikTok audio as MP3 for music and sounds",
      "Full HD quality — same as the original upload",
      "No TikTok account or app required",
      "Works on iPhone, Android, PC, and Mac",
      "Completely free with no download limits",
    ],
    faq: [
      {
        q: "Can I remove the TikTok watermark?",
        a: "Yes. Our downloader saves TikTok videos without the TikTok watermark, giving you a clean MP4 file you can share, edit, or repost.",
      },
      {
        q: "How do I copy a TikTok link?",
        a: "Open the TikTok app, find the video you want, tap the 'Share' button (arrow icon), then tap 'Copy Link'. You can also copy the URL from your browser if you're using TikTok on the web.",
      },
      {
        q: "Can I download TikTok audio only?",
        a: "Yes. You can extract just the audio from any TikTok video and save it as an MP3 file — great for saving trending sounds and songs.",
      },
      {
        q: "Is there a limit on downloads?",
        a: "No. You can download as many TikTok videos as you want, completely free. There are no daily limits or hidden restrictions.",
      },
      {
        q: "Does this work without the TikTok app?",
        a: "Yes. You just need the TikTok video URL. You can get it from the TikTok website on any browser, or from the app's share menu.",
      },
    ],
    seoContent: [
      "Want to save TikTok videos without the annoying watermark? Clowd's TikTok downloader removes the watermark and saves videos as clean MP4 files in full HD quality. Perfect for sharing on other platforms, editing in your video editor, or just keeping your favorite TikToks offline.",
      "TikTok's built-in save feature adds a watermark and sometimes reduces quality. Our tool bypasses that entirely, delivering the original quality video without any branding overlays. You can also extract just the audio as an MP3 — ideal for saving trending sounds.",
      "Powered by cobalt.tools, an open-source download engine trusted by millions. No ads, no popups, no malware. Just paste the link and download. Works on every device without installing anything.",
    ],
  },
];

export const getDownloaderBySlug = (slug: string): DownloaderPlatform | undefined =>
  DOWNLOADER_PLATFORMS.find((p) => p.slug === slug);
