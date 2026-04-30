'use client';

interface PlateInputProps {
  id: string;
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}

export default function PlateInput({
  id,
  value,
  onChange,
  label = 'Biển số xe',
  placeholder = 'VD: 51F-123.45',
}: PlateInputProps) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="block text-[11px] text-gray-500 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={12}
        className="
          w-full px-3.5 py-2.5 bg-gray-50 border border-black/10 rounded-xl
          text-gray-900 text-sm tracking-wider
          placeholder:text-gray-400
          outline-none transition-colors
          focus:border-blue-500
          font-[inherit]
        "
      />
    </div>
  );
}
