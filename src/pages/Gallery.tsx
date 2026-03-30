import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Lock, Loader2, CheckCircle2, XCircle, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const ADMIN_PASSWORD = "clowd2026";

interface GalleryPhoto {
  id: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  ai_description: string | null;
  created_at: string;
}

const Gallery = () => {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem("gallery_auth") === "true");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authenticated) fetchPhotos();
  }, [authenticated]);

  const fetchPhotos = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setPhotos((data as GalleryPhoto[]) || []);
    setLoading(false);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Only image and video files are supported.");
      return;
    }

    // For videos, skip AI analysis and just store
    if (file.type.startsWith("video/")) {
      toast.info("Video files are stored without AI analysis.");
      await uploadFile(file, "Video file");
      return;
    }

    setUploading(true);
    setUploadStatus("Analyzing image with AI...");

    try {
      const base64 = await fileToBase64(file);

      const { data: result, error } = await supabase.functions.invoke("analyze-image", {
        body: { imageBase64: base64, mimeType: file.type },
      });

      if (error) {
        toast.error("AI analysis failed. Please try again.");
        setUploading(false);
        setUploadStatus("");
        return;
      }

      if (!result.hasFemale) {
        setUploadStatus("Rejected — no female detected.");
        toast.error(`Image rejected: ${result.description || "No female detected in image."}`);
        setTimeout(() => setUploadStatus(""), 3000);
        setUploading(false);
        return;
      }

      setUploadStatus("Female detected! Uploading...");
      await uploadFile(file, result.description || "");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  const uploadFile = async (file: File, description: string) => {
    const filePath = `${Date.now()}-${file.name}`;

    const { error: storageError } = await supabase.storage
      .from("gallery")
      .upload(filePath, file);

    if (storageError) {
      toast.error("Failed to upload file.");
      return;
    }

    await supabase.from("gallery_photos").insert({
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      ai_description: description,
    });

    toast.success("Photo added to gallery!");
    setUploadStatus("Uploaded successfully!");
    fetchPhotos();
  };

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("gallery_auth", "true");
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Incorrect password");
    }
  };

  if (!authenticated) {
    return (
      <>
        <Helmet>
          <title>Gallery Login — Clowd Converter</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center px-4">
            <form onSubmit={handleLogin} className="bg-card border border-border rounded-xl p-8 w-full max-w-sm space-y-4">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Lock className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Gallery Access</h1>
              </div>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
              {authError && <p className="text-destructive text-sm text-center">{authError}</p>}
              <Button type="submit" className="w-full h-11">Unlock</Button>
            </form>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Photo Gallery — Clowd Converter</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-6">Photo Gallery</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Upload images — AI will only accept photos containing a female.
          </p>

          {/* Upload area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-8 ${
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !uploading && inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.target.value = "";
              }}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-foreground font-medium">{uploadStatus}</p>
              </div>
            ) : uploadStatus.includes("Rejected") ? (
              <div className="flex flex-col items-center gap-2">
                <XCircle className="w-10 h-10 text-destructive" />
                <p className="text-destructive font-medium">{uploadStatus}</p>
              </div>
            ) : uploadStatus.includes("successfully") ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
                <p className="text-green-600 font-medium">{uploadStatus}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-primary/60" />
                <p className="font-semibold text-foreground">Drop an image here or click to browse</p>
                <p className="text-xs text-muted-foreground">AI will verify the image before accepting</p>
              </div>
            )}
          </div>

          {/* Gallery grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No photos yet. Upload one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                  <img
                    src={getPublicUrl(photo.file_path)}
                    alt={photo.ai_description || photo.file_name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <div>
                      <p className="text-white text-xs font-medium truncate">{photo.file_name}</p>
                      {photo.ai_description && (
                        <p className="text-white/70 text-[10px] truncate">{photo.ai_description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Gallery;
