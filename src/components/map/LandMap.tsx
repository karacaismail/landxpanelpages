import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Leaflet default marker icon fix (Vite bundling)
const icon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  href?: string;
}

interface Props {
  points: MapPoint[];
  height?: string | number;
  zoom?: number;
  center?: [number, number];
  className?: string;
}

export function LandMap({ points, height = 360, zoom, center, className }: Props) {
  // Compute bounds-friendly center
  const resolvedCenter: [number, number] = center
    ?? (points.length ? [points[0].lat, points[0].lng] : [39.0, 35.0]);
  const resolvedZoom = zoom ?? (points.length === 1 ? 11 : points.length ? 6 : 6);

  return (
    <div className={className} style={{ height }}>
      <MapContainer
        center={resolvedCenter}
        zoom={resolvedZoom}
        scrollWheelZoom
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        aria-label="Harita"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={icon}>
            {p.title && (
              <Popup>
                {p.href ? <a className="text-brand-700 hover:underline" href={p.href}>{p.title}</a> : p.title}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
