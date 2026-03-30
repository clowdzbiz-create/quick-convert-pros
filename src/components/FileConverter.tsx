import { useState, useRef, useCallback } from "react";
import { Upload, Download, Loader2, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertFile } from "@/lib/converter";

type MediaType = "video" | "audio" | "image";

const FORMAT_MAP: Record<MediaType, string[]> = {
  video: ["MP4", "WebM", "MOV", "AVI", "MKV", "FLV"],
  audio: ["MP3", "WAV", "OGG", "AAC", "FLAC", "M4A"],
  image: ["JPG", "PNG", "WebP", "GIF", "BMP"],
};

const ACCEPT_MAP: Record<MediaType, string> = {
  video: "video/*",
  audio: "audio/*",
  image: "image/*",
};

const FileConverter = () => {
  const [mediaType, setMediaType] = useState<MediaType>("video");
  const [selectedFormat, setSelectedFormat] = useState<string>("MP4");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTypeChange = (type: MediaType) => {
    setMediaType(type);
    setSelectedFormat(FORMAT_MAP[type][0]);
    resetState();
  };

  const resetState = () => {
    setFile(null);
    setResultUrl(null);
    setError(null);
    setProgress(0);
    setConverting(false);
  };

  const handleFile = (f: File) => {
    setFile(f);
    setResultUrl(null);
    setError(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setConverting(true);
    setError(null);
    setProgress(10);

    try {
      const result = await convertFile(file, selectedFormat.toLowerCase(), mediaType, (p) => setProgress(p));
      setResultUrl(result);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || "Conversion failed. Please try a different file.");
    } finally {
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    const ext = selectedFormat.toLowerCase() === "jpg" ? "jpeg" : selectedFormat.toLowerCase();
    a.download = `${file.name.replace(/\.[^.]+$/, "")}.${ext}`;
    a.click();
  };

  const tabs: { key: MediaType; label: string }[] = [
    { key: "video", label: "Video" },
    { key: "audio", label: "Audio" },
    { key: "image", label: "Image" },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto px-4 animate-fade-in">
      <div className="converter-card">
        {/* Media type tabs */}
        <div className="flex justify-center gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTypeChange(t.key)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                mediaType === t.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Dropzone */}
        <div
          className={`dropzone ${isDragging ? "active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={ACCEPT_MAP[mediaType]}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <p className="font-semibold text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetState();
                }}
                className="text-xs text-destructive hover:underline mt-1"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-10 h-10 text-primary/60" />
              <p className="font-semibold text-foreground">Drop your file here or click to browse</p>
              <p className="text-xs text-muted-foreground">Max file size: 500MB</p>
            </div>
          )}
        </div>

        {/* Format grid */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          {FORMAT_MAP[mediaType].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`format-chip ${selectedFormat === fmt ? "selected" : ""}`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        {converting && (
          <div className="mt-4 w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Convert / Download button */}
        <Button
          className="w-full mt-5 h-12 text-base font-semibold"
          onClick={resultUrl ? handleDownload : handleConvert}
          disabled={!file || converting}
        >
          {converting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Converting...
            </>
          ) : resultUrl ? (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download {selectedFormat}
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Convert to {selectedFormat}
            </>
          )}
        </Button>
      </div>
    </section>
  );
};

export default FileConverter;
