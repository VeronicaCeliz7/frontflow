import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Ubicacion } from '../types/reporte';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { FaCrosshairs, FaLocationArrow } from 'react-icons/fa';

// Función para obtener color según categoría (para el administrador)
const getColorByCategoria = (categoria: string): string => {
  switch (categoria) {
    case 'bache': return '#EF4444';      // Rojo
    case 'semaforo': return '#F59E0B';   // Amarillo
    case 'iluminacion': return '#3B82F6'; // Azul
    case 'basura': return '#10B981';     // Verde
    case 'seguridad': return '#1F2937';  // Negro/Gris
    case 'otros': return '#8B5CF6';      // Morado
    default: return '#3B82F6';           // Azul por defecto
  }
};

// Ícono personalizado con efecto de brillo (para el marcador)
const createCustomIcon = (color = '#3B82F6', glow = true) => {
  return divIcon({
    html: renderToString(
      <div className="relative">
        {/* Sombra/brillo externo */}
        {glow && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-75" 
               style={{ 
                 backgroundColor: color,
                 width: '40px',
                 height: '40px',
                 left: '-8px',
                 top: '-28px',
                 borderRadius: '50%'
               }} 
          />
        )}
        {/* Icono principal */}
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

// Props del componente con tipos
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

  // Obtener el color según la categoría seleccionada por el usuario
  const markerColor = getColorByCategoria(categoria);
  const activeIcon = createCustomIcon(gpsActive ? '#10B981' : markerColor, true);

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
        if (error.code === 1) mensaje += '📱 Permiso denegado. Activá el GPS.';
        else if (error.code === 2) mensaje += '📡 Señal GPS débil.';
        else mensaje += '🔄 Intentá de nuevo.';
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
          direccion: `📍 Selección manual: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          coordenadas: { lat, lng }
        });
      },
    });
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Botón GPS con efecto brillante */}
      <button
        type="button"
        onClick={obtenerMiUbicacion}
        disabled={buscando}
        className="relative w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden group"
      >
        {/* Efecto de brillo en hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        {buscando ? (
          <>
            <div className="animate-spin">
              <FaCrosshairs className="text-white text-xl" />
            </div>
            <span className="font-medium">🛰️ Buscando GPS...</span>
          </>
        ) : (
          <>
            <div className={`relative ${gpsActive ? 'animate-pulse' : ''}`}>
              <div className={`absolute inset-0 rounded-full bg-green-400 ${gpsActive ? 'animate-ping' : ''}`} 
                   style={{ width: '28px', height: '28px', left: '-4px', top: '-4px' }} />
              <FaLocationArrow className="text-white text-xl relative z-10" />
            </div>
            <span className="font-medium">📍 Usar mi ubicación actual</span>
          </>
        )}
      </button>

      {/* Mapa con marcador brillante */}
      <MapContainer
        center={[markerPosition.lat, markerPosition.lng]}
        zoom={14}
        style={{ height: '400px', width: '100%', borderRadius: '1rem' }}
        className="shadow-lg ring-1 ring-white/20"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
                direccion: `📍 Ubicación ajustada: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                coordenadas: { lat, lng }
              });
            },
          }}
        />
        
        <MapClickHandler />
      </MapContainer>

      {/* Instrucciones mejoradas */}
      <div className="text-gray-400 text-xs text-center space-y-1">
        <div className="flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Marcador brillante
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            GPS activo
          </span>
        </div>
        <p>💡 Click en el mapa o arrastrá el marcador • El GPS usa la señal de tu dispositivo</p>
      </div>
    </div>
  );
};

export default MapaIncidente;