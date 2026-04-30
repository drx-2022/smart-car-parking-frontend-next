'use client';

interface CameraFeedProps {
  src: string;
  slotLabel?: string;
}

export default function CameraFeed({ src, slotLabel }: CameraFeedProps) {
  return (
    <div className="mx-4 rounded-2xl overflow-hidden bg-black border border-black/10 relative aspect-video">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Camera stream"
        className="w-full h-full object-cover block rotate-180 scale-115"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='390' height='260'><rect width='390' height='260' fill='%23111827'/><text x='195' y='130' fill='rgba(255,255,255,.3)' font-size='13' text-anchor='middle' font-family='sans-serif'>Camera chưa kết nối</text></svg>";
        }}
      />
      <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start">
        <span className="bg-black/70 backdrop-blur border border-white/15 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-red-500">
          ● LIVE
        </span>
        {slotLabel && (
          <span className="bg-black/70 backdrop-blur border border-white/15 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-blue-400">
            {slotLabel}
          </span>
        )}
      </div>
    </div>
  );
}
