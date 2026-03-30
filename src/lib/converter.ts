/**
 * Client-side file converter
 * Uses Canvas API for images, FFmpeg.wasm for audio/video
 * FFmpeg instance is cached as a singleton for speed
 */

import ffmpegClassWorkerURL from "@ffmpeg/ffmpeg/dist/esm/worker.js?url";

type ProgressCallback = (progress: number, label?: string) => void;

// Image conversion using Canvas API (fast, native)
async function convertImage(file: File, targetFormat: string, onProgress: ProgressCallback): Promise<string> {
  onProgress(20, "Reading image...");

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    // Compatibility fallback for browsers/files where createImageBitmap fails
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Failed to decode image"));
      el.src = dataUrl;
    });

    const fallbackCanvas = document.createElement("canvas");
    fallbackCanvas.width = img.naturalWidth || img.width;
    fallbackCanvas.height = img.naturalHeight || img.height;
    const fallbackCtx = fallbackCanvas.getContext("2d");
    if (!fallbackCtx) throw new Error("No canvas context");
    fallbackCtx.drawImage(img, 0, 0);

    const fallbackBlob = await new Promise<Blob | null>((resolve) =>
      fallbackCanvas.toBlob(resolve, targetFormat === "jpg" ? "image/jpeg" : `image/${targetFormat}`, 0.92)
    );
    if (!fallbackBlob) throw new Error("Failed to convert image");
    onProgress(95, "Finalizing...");
    return URL.createObjectURL(fallbackBlob);
  }

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
let ffmpegReady = false;
let ffmpegLoading: Promise<any> | null = null;

async function getFFmpeg(onProgress: ProgressCallback): Promise<any> {
  if (ffmpegReady && ffmpegInstance) return ffmpegInstance;
  
  if (ffmpegLoading) {
    onProgress(15, "Preparing converter...");
    return ffmpegLoading;
  }

  ffmpegLoading = (async () => {
    onProgress(10, "Loading converter (first time may take a moment)...");
    
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    
    const ffmpeg = new FFmpeg();
    
    onProgress(15, "Downloading converter engine...");

    // Helper: fetch a URL and convert to a blob URL with the given MIME type
    const makeBlobURL = async (url: string, mime: string): Promise<string> => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
      const buf = await res.arrayBuffer();
      const blob = new Blob([buf], { type: mime });
      return URL.createObjectURL(blob);
    };

    const withTimeout = async <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
      let timeoutId: number | null = null;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error(label)), ms);
      });
      try {
        return await Promise.race([promise, timeoutPromise]);
      } finally {
        if (timeoutId !== null) window.clearTimeout(timeoutId);
      }
    };

    try {
      // Always create blob URLs — required for Web Worker creation
      const [coreURL, wasmURL] = await Promise.all([
        makeBlobURL("/ffmpeg-core/ffmpeg-core.js", "text/javascript"),
        makeBlobURL("/ffmpeg-core/ffmpeg-core.wasm", "application/wasm"),
      ]);

      onProgress(20, "Initializing converter...");
      await withTimeout(
        ffmpeg.load({
          classWorkerURL: ffmpegClassWorkerURL,
          coreURL,
          wasmURL,
          workerURL: coreURL,
        }),
        25000,
        "Converter initialization timed out"
      );
    } catch (localErr) {
      console.warn("Local FFmpeg load failed, trying CDN...", localErr);
      
      try {
        const cdnBase = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm";
        const [coreURL, wasmURL] = await Promise.all([
          makeBlobURL(`${cdnBase}/ffmpeg-core.js`, "text/javascript"),
          makeBlobURL(`${cdnBase}/ffmpeg-core.wasm`, "application/wasm"),
        ]);
        await withTimeout(
          ffmpeg.load({
            classWorkerURL: ffmpegClassWorkerURL,
            coreURL,
            wasmURL,
            workerURL: coreURL,
          }),
          30000,
          "Converter initialization timed out"
        );
      } catch (cdnErr) {
        console.error("FFmpeg load failed (local + CDN):", localErr, cdnErr);
      // Reset so next attempt can retry
      ffmpegLoading = null;
      ffmpegReady = false;
      ffmpegInstance = null;
      throw new Error(
        "Could not load the converter engine. Please refresh and try again. If it still fails, try Chrome/Edge or disable strict ad/script blockers."
      );
      }
    }
    
    ffmpegInstance = ffmpeg;
    ffmpegReady = true;
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

  const inputExt = file.name.split(".").pop()?.toLowerCase() || "mp4";
  const inputName = `input.${inputExt}`;
  const outputName = `output.${targetFormat}`;

  // Clean up any previous files
  try { await ffmpeg.deleteFile(inputName); } catch {}
  try { await ffmpeg.deleteFile(outputName); } catch {}

  await ffmpeg.writeFile(inputName, await fetchFile(file));
  onProgress(45, "Converting...");

  // Build optimized ffmpeg args based on target format
  const args = buildFFmpegArgs(inputName, outputName, targetFormat, inputExt);
  const targetFallbackArgs =
    targetFormat === "webm"
      ? ["-i", inputName, "-c:v", "libvpx", "-crf", "34", "-b:v", "0", "-an", outputName]
      : null;
  const compatibilityArgs = ["-i", inputName, outputName];

  let exitCode = await ffmpeg.exec(args);

  // Target-specific reliability fallback (WEBM can fail on audio codec combinations in wasm builds)
  if (exitCode !== 0 && targetFallbackArgs && args.join(" ") !== targetFallbackArgs.join(" ")) {
    onProgress(55, "Retrying with WEBM-safe settings...");
    try { await ffmpeg.deleteFile(outputName); } catch {}
    exitCode = await ffmpeg.exec(targetFallbackArgs);
  }

  // Reliability fallback: retry with minimal command if optimized args fail
  if (exitCode !== 0 && args.join(" ") !== compatibilityArgs.join(" ")) {
    onProgress(55, "Retrying in compatibility mode...");
    try { await ffmpeg.deleteFile(outputName); } catch {}
    exitCode = await ffmpeg.exec(compatibilityArgs);
  }

  if (exitCode !== 0) {
    throw new Error(
      `Conversion failed (code ${exitCode}). The input codec/container pair may not be supported for this target format.`
    );
  }
  
  onProgress(85, "Packaging output...");

  let data: any;
  try {
    data = await ffmpeg.readFile(outputName);
  } catch {
    throw new Error(
      "Conversion produced no output. The input file format may not be compatible. Try a different file or format."
    );
  }
  
  const uint8 = new Uint8Array(data as Uint8Array);
  if (uint8.length === 0) {
    throw new Error("Conversion produced an empty file. Try a different input file or target format.");
  }
  
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

  // Video-to-video: prefer compatibility over aggressive encoder flags
  if (videoExts.includes(inputExt) && videoExts.includes(targetFmt)) {
    if (targetFmt === "webm") {
      return ["-i", input, "-c:v", "libvpx", "-crf", "32", "-b:v", "0", "-c:a", "libvorbis", output];
    }
    return ["-i", input, output];
  }

  // Video to GIF
  if (videoExts.includes(inputExt) && targetFmt === "gif") {
    return ["-i", input, "-vf", "fps=10,scale=480:-1:flags=lanczos", "-t", "10", output];
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
