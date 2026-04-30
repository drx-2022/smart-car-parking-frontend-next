interface QRDisplayProps {
  qrUrl: string | null;
  loading?: boolean;
  error?: string | null;
}

export default function QRDisplay({ qrUrl, loading, error }: QRDisplayProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-2">
      {loading && (
        <>
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-[11px] text-gray-500">Đang tạo mã QR…</p>
        </>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {qrUrl && !loading && !error && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="VietQR"
            className="w-[200px] h-[200px] rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const p = document.createElement('p');
              p.textContent = 'Không tải được mã QR';
              p.className = 'text-red-500 text-xs';
              (e.target as HTMLImageElement).parentElement?.appendChild(p);
            }}
          />
          <p className="text-[11px] text-gray-500 text-center">Mở app ngân hàng và quét mã QR</p>
        </>
      )}
    </div>
  );
}
