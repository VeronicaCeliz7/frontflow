import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapaInterno() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const lat = parseFloat(searchParams.get('lat') || '-31.7');
  const lng = parseFloat(searchParams.get('lng') || '-63.5');
  const zoom = parseInt(searchParams.get('zoom') || '18');

  return (
    <div className="relative h-screen w-full">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        ← Volver
      </button>

      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>Ubicación del reporte</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}