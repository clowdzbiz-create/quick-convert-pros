/**
 * Client-side file converter
 * Uses Canvas API for images, FFmpeg.wasm for audio/video
 */

type ProgressCallback = (progress: number, label?: string) => void;

// Image conversion using Canvas API
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

// Audio/Video conversion using FFmpeg.wasm
async function convertMedia(file: File, targetFormat: string, onProgress: ProgressCallback): Promise<string> {
  onProgress(10, "Loading converter engine...");
  
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { fetchFile } = await import("@ffmpeg/util");
  
  const ffmpeg = new FFmpeg();
  
  onProgress(20, "Initializing FFmpeg...");

  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL: "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.js",
      wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm/ffmpeg-core.wasm",
    });
  }

  onProgress(40, "Reading file...");

  const inputExt = file.name.split(".").pop() || "mp4";
  const inputName = `input.${inputExt}`;
  const outputName = `output.${targetFormat}`;

  await ffmpeg.writeFile(inputName, await fetchFile(file));
  onProgress(55, "Converting...");

  await ffmpeg.exec(["-i", inputName, outputName]);
  onProgress(85, "Packaging output...");

  const data = await ffmpeg.readFile(outputName);
  const uint8 = new Uint8Array(data as Uint8Array);
  const audioFormats = ["mp3", "wav", "ogg", "aac", "flac", "m4a"];
  const mimeType = audioFormats.includes(targetFormat) ? `audio/${targetFormat}` : `video/${targetFormat}`;
  const blob = new Blob([uint8], { type: mimeType });
  
  onProgress(95, "Finalizing...");
  return URL.createObjectURL(blob);
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
