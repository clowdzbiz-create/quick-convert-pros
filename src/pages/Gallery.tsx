import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Image as ImageIcon } from "lucide-react";

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

  const getPublicUrl = (filePath: string) => {
    const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
    return data.publicUrl;
  };

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
            Images auto-saved from conversions when AI detects a female.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No photos yet. They'll appear here automatically when users convert images containing females.</p>
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
                  <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <div>
                      <p className="text-background text-xs font-medium truncate">{photo.file_name}</p>
                      {photo.ai_description && (
                        <p className="text-background/70 text-[10px] truncate">{photo.ai_description}</p>
                      )}
                      <p className="text-background/50 text-[10px]">
                        {new Date(photo.created_at).toLocaleDateString()}
                      </p>
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
