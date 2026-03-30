import { useState } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Recommendation {
  recommended: string;
  reason: string;
  alternatives: { format: string; reason: string }[];
}

interface FormatAdvisorProps {
  fileName?: string;
  onSelectFormat?: (format: string) => void;
}

const FormatAdvisor = ({ fileName, onSelectFormat }: FormatAdvisorProps) => {
  const [useCase, setUseCase] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  const getRecommendation = async () => {
    if (!fileName && !useCase) {
      toast.error("Upload a file or describe your use case first.");
      return;
    }

    setLoading(true);
    setRecommendation(null);

    try {
      const { data, error } = await supabase.functions.invoke("format-advisor", {
        body: {
          fileName: fileName || "unknown-file",
          currentFormat: fileName?.split(".").pop() || "",
          useCase,
        },
      });

      if (error) throw error;
      setRecommendation(data);
    } catch (err: any) {
      console.error("Format advisor error:", err);
      toast.error("Couldn't get recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="converter-card mt-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-foreground text-lg">AI Format Advisor</h2>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
          Powered by AI
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Not sure which format to use? Describe what you need and our AI will recommend the best format.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          placeholder="e.g., 'for my website', 'to share on WhatsApp', 'for audio editing'"
          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          onKeyDown={(e) => e.key === "Enter" && getRecommendation()}
        />
        <Button onClick={getRecommendation} disabled={loading} size="default">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-1" />
              Advise
            </>
          )}
        </Button>
      </div>

      {recommendation && (
        <div className="mt-4 space-y-3 animate-fade-in">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                  Recommended
                </span>
                <p className="text-lg font-bold text-foreground mt-1">
                  {recommendation.recommended}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {recommendation.reason}
                </p>
              </div>
              {onSelectFormat && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectFormat(recommendation.recommended)}
                >
                  Use <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {recommendation.alternatives.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Alternatives
              </span>
              {recommendation.alternatives.map((alt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <span className="font-semibold text-foreground text-sm">
                      {alt.format}
                    </span>
                    <p className="text-xs text-muted-foreground">{alt.reason}</p>
                  </div>
                  {onSelectFormat && (
                    <button
                      onClick={() => onSelectFormat(alt.format)}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      Use this
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormatAdvisor;
