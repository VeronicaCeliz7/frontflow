import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapaInterno() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const lat = parseFloat(searchParams.get('lat') || '-31.7');
  const lng = parseFloat(searchParams.get('lng') || '-63.5');
  const zoom = parseInt(searchParams.get('zoom') || '18');
  const direccion = searchParams.get('direccion') || 'Dirección no disponible';

  return (
    <div className="relative h-screen w-full">
      {/* Botón volver - ARRIBA IZQUIERDA */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        ← Volver
      </button>

      {/* Mapa - OCUPA TODA LA PANTALLA */}
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
        
        {/* CircleMarker en lugar de Marker - más confiable */}
        <CircleMarker
          center={[lat, lng]}
          radius={12}
          pathOptions={{
            color: '#2563eb',
            fillColor: '#3b82f6',
            fillOpacity: 0.7,
            weight: 3,
          }}
        >
          <Popup>
            <strong>Ubicación del reporte</strong>
            <p className="text-sm text-gray-600">{direccion}</p>
          </Popup>
        </CircleMarker>
      </MapContainer>

      {/* Tarjeta SUBIDA - bottom-20 en lugar de bottom-6 */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[1000] bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-4 max-w-sm w-[90%] border-2 border-blue-500 dark:border-blue-400">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
          <span className="text-lg">📍</span> Ubicación del reporte
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 font-medium">
          {direccion}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Coordenadas: {lat.toFixed(6)}, {lng.toFixed(6)}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition"
        >
          ← Volver al detalle
        </button>
      </div>
    </div>
  );
}