/**
 * Client-side file converter
 * Uses Canvas API for images, FFmpeg.wasm for audio/video
 * FFmpeg instance is cached as a singleton for speed
 */

type ProgressCallback = (progress: number, label?: string) => void;

// Image conversion using Canvas API (fast, native)
async function convertImage(file: File, targetFormat: string, onProgress: ProgressCallback): Promise<string> {
  onProgress(20, "Reading image...");
  
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  
  onProgress(60, "Converting format...");

  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    bmp: "image/bmp",
  };

  const mime = mimeMap[targetFormat] || "image/png";
  
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to convert image"));
          return;
        }
        onProgress(95, "Finalizing...");
        resolve(URL.createObjectURL(blob));
      },
      mime,
      0.92
    );
  });
}

// Singleton FFmpeg instance for fast repeated conversions
let ffmpegInstance: any = null;
let ffmpegLoading: Promise<any> | null = null;

async function getFFmpeg(onProgress: ProgressCallback): Promise<any> {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  
  if (ffmpegLoading) {
    onProgress(15, "Waiting for converter engine...");
    return ffmpegLoading;
  }

  ffmpegLoading = (async () => {
    onProgress(10, "Loading converter engine...");
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");
    
    const ffmpeg = new FFmpeg();
    
    onProgress(15, "Downloading FFmpeg core...");

    // Use toBlobURL for proper CORS handling and caching
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm";
    const coreURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript");
    const wasmURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm");

    await ffmpeg.load({ coreURL, wasmURL });
    
    ffmpegInstance = ffmpeg;
    ffmpegLoading = null;
    return ffmpeg;
  })();

  return ffmpegLoading;
}

// Audio/Video conversion using FFmpeg.wasm with cached instance
async function convertMedia(file: File, targetFormat: string, onProgress: ProgressCallback): Promise<string> {
  const ffmpeg = await getFFmpeg(onProgress);
  
  const { fetchFile } = await import("@ffmpeg/util");
  
  onProgress(30, "Reading file...");

  const inputExt = file.name.split(".").pop() || "mp4";
  const inputName = `input.${inputExt}`;
  const outputName = `output.${targetFormat}`;

  // Clean up any previous files
  try { await ffmpeg.deleteFile(inputName); } catch {}
  try { await ffmpeg.deleteFile(outputName); } catch {}

  await ffmpeg.writeFile(inputName, await fetchFile(file));
  onProgress(45, "Converting...");

  // Build optimized ffmpeg args based on target format
  const args = buildFFmpegArgs(inputName, outputName, targetFormat, inputExt);
  
  await ffmpeg.exec(args);
  onProgress(85, "Packaging output...");

  const data = await ffmpeg.readFile(outputName);
  const uint8 = new Uint8Array(data as Uint8Array);
  const audioFormats = ["mp3", "wav", "ogg", "aac", "flac", "m4a", "wma"];
  const mimeType = audioFormats.includes(targetFormat) ? `audio/${targetFormat === "m4a" ? "mp4" : targetFormat}` : `video/${targetFormat}`;
  const blob = new Blob([uint8], { type: mimeType });
  
  // Clean up files from virtual FS
  try { await ffmpeg.deleteFile(inputName); } catch {}
  try { await ffmpeg.deleteFile(outputName); } catch {}

  onProgress(95, "Finalizing...");
  return URL.createObjectURL(blob);
}

function buildFFmpegArgs(input: string, output: string, targetFmt: string, inputExt: string): string[] {
  // Audio extraction from video (e.g. mp4 → mp3)
  const videoExts = ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv", "video"];
  const audioExts = ["mp3", "wav", "ogg", "aac", "flac", "m4a", "wma"];
  
  if (videoExts.includes(inputExt) && audioExts.includes(targetFmt)) {
    // Extract audio only — much faster, no video re-encoding
    if (targetFmt === "mp3") return ["-i", input, "-vn", "-ab", "192k", "-f", "mp3", output];
    if (targetFmt === "wav") return ["-i", input, "-vn", "-f", "wav", output];
    if (targetFmt === "aac") return ["-i", input, "-vn", "-c:a", "aac", "-b:a", "192k", output];
    if (targetFmt === "flac") return ["-i", input, "-vn", "-c:a", "flac", output];
    if (targetFmt === "ogg") return ["-i", input, "-vn", "-c:a", "libvorbis", "-q:a", "6", output];
    if (targetFmt === "m4a") return ["-i", input, "-vn", "-c:a", "aac", "-b:a", "192k", "-f", "ipod", output];
    return ["-i", input, "-vn", output];
  }

  // Audio-to-audio conversion
  if (audioExts.includes(inputExt) && audioExts.includes(targetFmt)) {
    if (targetFmt === "mp3") return ["-i", input, "-ab", "192k", "-f", "mp3", output];
    if (targetFmt === "ogg") return ["-i", input, "-c:a", "libvorbis", "-q:a", "6", output];
    return ["-i", input, output];
  }

  // Video-to-video: use fast preset
  if (videoExts.includes(inputExt) && videoExts.includes(targetFmt)) {
    return ["-i", input, "-preset", "ultrafast", "-crf", "23", output];
  }

  // Default
  return ["-i", input, output];
}

export async function convertFile(
  file: File,
  targetFormat: string,
  mediaType: "video" | "audio" | "image",
  onProgress: ProgressCallback
): Promise<string> {
  if (mediaType === "image") {
    return convertImage(file, targetFormat, onProgress);
  }
  return convertMedia(file, targetFormat, onProgress);
}
