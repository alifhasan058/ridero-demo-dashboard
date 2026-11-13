import { useState } from 'react';
import { Car } from 'lucide-react';

interface VehicleImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function VehicleImage({ src, alt, className = '', fallbackLabel }: VehicleImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-500 p-4 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Car className="w-10 h-10 text-[#0F2040]/40 mb-2" strokeWidth={1.5} />
        <span className="text-xs font-medium text-slate-600 text-center">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
