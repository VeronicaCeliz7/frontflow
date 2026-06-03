import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Ubicacion } from '../types/reporte';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { FaCrosshairs, FaLocationArrow } from 'react-icons/fa';

// Función para obtener color según categoría
const getColorByCategoria = (categoria: string): string => {
  switch (categoria) {
    case 'bache': return '#EF4444';
    case 'semaforo': return '#F59E0B';
    case 'iluminacion': return '#3B82F6';
    case 'basura': return '#10B981';
    case 'seguridad': return '#1F2937';
    case 'otros': return '#8B5CF6';
    default: return '#3B82F6';
  }
};

// Ícono personalizado del marcador
const createCustomIcon = (color = '#3B82F6') => {
  return divIcon({
    html: renderToString(
      <div className="relative">
        <div className="relative" style={{ transform: 'translate(-8px, -28px)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                  fill={color} 
                  stroke="white" 
                  strokeWidth="2"/>
            <circle cx="12" cy="9" r="3" fill="white"/>
          </svg>
        </div>
      </div>
    ),
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MapaIncidenteProps {
  onUbicacionChange: (ubicacion: Ubicacion) => void;
  ubicacionInicial?: { lat: number; lng: number };
  categoria?: string;
}

const MapaIncidente = ({ 
  onUbicacionChange, 
  ubicacionInicial, 
  categoria = 'otros' 
}: MapaIncidenteProps) => {
  const defaultCenter = { lat: -32.4075, lng: -63.2408 };
  const [markerPosition, setMarkerPosition] = useState(ubicacionInicial || defaultCenter);
  const [buscando, setBuscando] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);

  const markerColor = getColorByCategoria(categoria);
  const activeIcon = createCustomIcon(gpsActive ? '#10B981' : markerColor);

  const obtenerMiUbicacion = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }
    setBuscando(true);
    setGpsActive(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setMarkerPosition(coords);
        onUbicacionChange({
          direccion: `📍 Ubicación GPS: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
          coordenadas: coords
        });
        setBuscando(false);
        setTimeout(() => setGpsActive(false), 2000);
      },
      (error) => {
        console.error(error);
        let mensaje = 'No se pudo obtener tu ubicación. ';
        if (error.code === 1) mensaje += 'Permiso denegado. Activá el GPS.';
        else if (error.code === 2) mensaje += 'Señal GPS débil.';
        else mensaje += 'Intentá de nuevo.';
        alert(mensaje);
        setBuscando(false);
        setGpsActive(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition({ lat, lng });
        onUbicacionChange({
          direccion: `📍 Ubicación seleccionada`,
          coordenadas: { lat, lng }
        });
      },
    });
    return null;
  };

  return (
    <div className="space-y-3">
      {/* Botón GPS minimalista */}
      <button
        type="button"
        onClick={obtenerMiUbicacion}
        disabled={buscando}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {buscando ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            <span>Buscando GPS...</span>
          </>
        ) : (
          <>
            <FaLocationArrow size={14} />
            <span>Usar mi ubicación actual</span>
          </>
        )}
      </button>

      {/* Mapa */}
      <MapContainer
        center={[markerPosition.lat, markerPosition.lng]}
        zoom={14}
        style={{ height: '380px', width: '100%', borderRadius: '0.5rem' }}
        className="border border-gray-200"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker
          position={[markerPosition.lat, markerPosition.lng]}
          draggable={true}
          icon={activeIcon}
          eventHandlers={{
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng();
              setMarkerPosition({ lat, lng });
              onUbicacionChange({
                direccion: `📍 Ubicación ajustada`,
                coordenadas: { lat, lng }
              });
            },
          }}
        />
        
        <MapClickHandler />
      </MapContainer>

      {/* Mensaje de advertencia si no hay ubicación */}
      <div className="text-xs text-gray-500 text-center">
        <p>💡 Hacé clic en el mapa o arrastrá el marcador</p>
        <p className="text-gray-400 mt-1">La ubicación es obligatoria</p>
      </div>
    </div>
  );
};

export default MapaIncidente;