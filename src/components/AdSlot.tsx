import { useEffect, useRef } from "react";

interface AdSlotProps {
  width?: string;
  height?: string;
  label?: string;
  adSlot?: string;
  adFormat?: "auto" | "horizontal" | "vertical" | "rectangle";
}

const AdSlot = ({ width = "100%", height = "90px", label = "Ad Space", adFormat = "auto" }: AdSlotProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      const adsbygoogle = (window as any).adsbygoogle;
      if (adsbygoogle && adRef.current?.querySelector("ins")) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      // AdSense not loaded yet or blocked
    }
  }, []);

  return (
    <div
      ref={adRef}
      className="my-6 mx-auto max-w-3xl min-h-[90px]"
      style={{ width }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: height }}
        data-ad-client="ca-pub-4509267023103425"
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSlot;
