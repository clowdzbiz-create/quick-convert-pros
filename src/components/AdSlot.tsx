interface AdSlotProps {
  width?: string;
  height?: string;
  label?: string;
}

const AdSlot = ({ width = "100%", height = "90px", label = "Ad Space" }: AdSlotProps) => {
  return (
    <div
      className="ad-slot my-6 mx-auto max-w-3xl"
      style={{ width, height }}
    >
      {label}
    </div>
  );
};

export default AdSlot;
