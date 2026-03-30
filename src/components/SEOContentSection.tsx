import { Link } from "react-router-dom";

const SEOContentSection = () => {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-xl font-bold text-foreground mb-4">
        The Best Free Online File Converter in 2026
      </h2>
      <div className="prose prose-sm text-muted-foreground max-w-none space-y-4">
        <p>
          <strong className="text-foreground">Clowd Converter</strong> is a free, browser-based file conversion tool that lets you convert video, audio, and image files without uploading anything to a server. Unlike traditional online converters, your files are processed entirely on your device using cutting-edge WebAssembly technology.
        </p>
        
        <h3 className="text-foreground text-lg font-semibold mt-6 mb-2">Video Conversion</h3>
        <p>
          Convert between all major video formats including{" "}
          <Link to="/convert-mp4-to-mp3" className="text-primary underline hover:text-primary/80">MP4 to MP3</Link>,{" "}
          <Link to="/convert-mov-to-mp4" className="text-primary underline hover:text-primary/80">MOV to MP4</Link>,{" "}
          <Link to="/convert-webm-to-mp4" className="text-primary underline hover:text-primary/80">WebM to MP4</Link>,{" "}
          <Link to="/convert-avi-to-mp4" className="text-primary underline hover:text-primary/80">AVI to MP4</Link>,{" "}
          <Link to="/convert-mkv-to-mp4" className="text-primary underline hover:text-primary/80">MKV to MP4</Link>, and{" "}
          <Link to="/convert-mp4-to-gif" className="text-primary underline hover:text-primary/80">MP4 to GIF</Link>.
          Perfect for extracting audio from videos, converting iPhone recordings, or preparing videos for social media.
        </p>

        <h3 className="text-foreground text-lg font-semibold mt-6 mb-2">Audio Conversion</h3>
        <p>
          Easily convert audio files between formats:{" "}
          <Link to="/convert-mp3-to-wav" className="text-primary underline hover:text-primary/80">MP3 to WAV</Link>,{" "}
          <Link to="/convert-wav-to-mp3" className="text-primary underline hover:text-primary/80">WAV to MP3</Link>,{" "}
          <Link to="/convert-flac-to-mp3" className="text-primary underline hover:text-primary/80">FLAC to MP3</Link>,{" "}
          <Link to="/convert-m4a-to-mp3" className="text-primary underline hover:text-primary/80">M4A to MP3</Link>, and{" "}
          <Link to="/convert-ogg-to-mp3" className="text-primary underline hover:text-primary/80">OGG to MP3</Link>.
          Ideal for music production, podcast editing, or making audio compatible with any device.
        </p>

        <h3 className="text-foreground text-lg font-semibold mt-6 mb-2">Image Conversion</h3>
        <p>
          Convert images instantly:{" "}
          <Link to="/convert-png-to-jpg" className="text-primary underline hover:text-primary/80">PNG to JPG</Link>,{" "}
          <Link to="/convert-jpg-to-webp" className="text-primary underline hover:text-primary/80">JPG to WebP</Link>,{" "}
          <Link to="/convert-webp-to-jpg" className="text-primary underline hover:text-primary/80">WebP to JPG</Link>,{" "}
          <Link to="/convert-gif-to-png" className="text-primary underline hover:text-primary/80">GIF to PNG</Link>, and more.
          Optimize images for websites, social media, or reduce file sizes without losing quality.
        </p>

        <h3 className="text-foreground text-lg font-semibold mt-6 mb-2">How It Works</h3>
        <p>
          Clowd Converter uses <strong className="text-foreground">FFmpeg compiled to WebAssembly</strong> for video and audio conversion, and the <strong className="text-foreground">HTML5 Canvas API</strong> for image conversion. This means your files are processed using your device's own processing power — nothing is uploaded to any server.
        </p>
        <p>
          This approach is faster than server-based converters, completely private, and works even offline once the page has loaded. Read more in our{" "}
          <Link to="/blog" className="text-primary underline">conversion guides and tutorials</Link>.
        </p>
      </div>
    </section>
  );
};

export default SEOContentSection;
