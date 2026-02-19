import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface ComplaintMapProps {
  latitude: number;
  longitude: number;
}

export default function ComplaintMap({ latitude, longitude }: ComplaintMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create a simple static map using OpenStreetMap tiles
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;

    const iframe = document.createElement('iframe');
    iframe.src = mapUrl;
    iframe.width = '100%';
    iframe.height = '300';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '0.5rem';

    mapContainerRef.current.innerHTML = '';
    mapContainerRef.current.appendChild(iframe);
  }, [latitude, longitude]);

  if (latitude === undefined || longitude === undefined) {
    return (
      <div className="bg-muted rounded-lg p-8 text-center">
        <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No location data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={mapContainerRef} className="w-full h-[300px] bg-muted rounded-lg overflow-hidden" />
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>
          Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </span>
      </div>
    </div>
  );
}
