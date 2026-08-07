"use client";

import { useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
const getAuthToken = (): string | null => {
  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token")
  );
};
interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

function ClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Komponen kecil untuk menggerakkan peta secara halus ke lokasi hasil pencarian
function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, 17, { duration: 1 });
  }
  return null;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationSelect,
}: LocationPickerMapProps) {
  const position: [number, number] = [
    latitude || -6.917464,
    longitude || 107.619125,
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(
    null,
  );
  const [showResults, setShowResults] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const lastRequestTime = useRef<number>(0);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    const now = Date.now();
    if (now - lastRequestTime.current < 1000) {
      setRateLimitError(true);
      setTimeout(() => setRateLimitError(false), 2000);
      return;
    }
    lastRequestTime.current = now;

    setIsSearching(true);
    setShowResults(false);
    setRateLimitError(false);

    try {
      const token = getAuthToken(); // fungsi yang sudah ada di TambahLokasiWFOPopup.tsx

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/geocode/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 429) {
        setRateLimitError(true);
        return;
      }

      if (res.ok) {
        const data: SearchResult[] = await res.json();
        setSearchResults(data);
        setShowResults(true);

        if (data.length === 1) {
          handleSelectResult(data[0]);
        }
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    onLocationSelect(lat, lon);
    setFlyToPosition([lat, lon]);
    setSearchQuery(result.display_name);
    setShowResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="relative">
      {/* Search Box */}
      <div className="relative mb-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          placeholder="Cari nama tempat, misal: Universitas Padjadjaran"
          className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="absolute right-1 top-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSearching ? "..." : "Cari"}
        </button>

        {/* Dropdown hasil pencarian */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute z-[1000] mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectResult(result)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                {result.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <MapContainer
        center={position}
        zoom={16}
        style={{ height: "300px", width: "100%", borderRadius: "0.5rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={position}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const pos = marker.getLatLng();
              onLocationSelect(pos.lat, pos.lng);
            },
          }}
        />
        <ClickHandler onLocationSelect={onLocationSelect} />
        <FlyToLocation position={flyToPosition} />
      </MapContainer>
    </div>
  );
}
