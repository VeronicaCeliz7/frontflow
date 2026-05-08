import { useState } from 'react';
import { Ubicacion } from '../types/reporte';

interface MapaIncidenteProps {
  onUbicacionChange: (ubicacion: Ubicacion) => void;
  ubicacionInicial?: { lat: number; lng: number };
}

const MapaIncidente = ({ onUbicacionChange, ubicacionInicial }: MapaIncidenteProps) => {
  const [ubicacion, setUbicacion] = useState(ubicacionInicial || null);
  const [buscandoUbicacion, setBuscandoUbicacion] = useState(false);
  const [errorGPS, setErrorGPS] = useState('');
  const [direccionManual, setDireccionManual] = useState('');

  // Obtener ubicación por GPS
  const obtenerMiUbicacion = () => {
    if (!navigator.geolocation) {
      setErrorGPS('❌ Tu navegador no soporta geolocalización');
      return;
    }

    setBuscandoUbicacion(true);
    setErrorGPS('');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUbicacion(coords);
        
        // Notificar al formulario padre
        onUbicacionChange({
          direccion: `Ubicación GPS: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
          coordenadas: coords
        });
        
        setBuscandoUbicacion(false);
      },
      (error) => {
        console.error('Error de geolocalización:', error);
        let mensaje = '';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            mensaje = '❌ Permiso denegado. Activa el GPS en tu celular y acepta el permiso.';
            break;
          case error.POSITION_UNAVAILABLE:
            mensaje = '📡 GPS no disponible. Intenta en un lugar con mejor señal.';
            break;
          case error.TIMEOUT:
            mensaje = '⏱️ Tiempo de espera agotado. ¿Tienes el GPS activado?';
            break;
          default:
            mensaje = '⚠️ No se pudo obtener tu ubicación. Activa el GPS.';
        }
        setErrorGPS(mensaje);
        setBuscandoUbicacion(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Permitir ingresar dirección manualmente (alternativa)
  const handleDireccionManual = (e: React.ChangeEvent<HTMLInputElement>) => {
    const texto = e.target.value;
    setDireccionManual(texto);
    
    // Si hay ubicación GPS, la reemplazamos por la dirección manual
    if (ubicacion) {
      setUbicacion(null);
    }
    
    // Notificar al formulario padre
    onUbicacionChange({
      direccion: texto,
      coordenadas: { lat: 0, lng: 0 }
    });
  };

  return (
    <div className="space-y-4">
      {/* Botón principal de GPS */}
      <button
        type="button"
        onClick={obtenerMiUbicacion}
        disabled={buscandoUbicacion}
        className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
      >
        {buscandoUbicacion ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Obteniendo ubicación GPS...
          </>
        ) : (
          <>📍 Usar mi ubicación actual (GPS)</>
        )}
      </button>

      {/* Mensaje de error */}
      {errorGPS && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
          {errorGPS}
        </div>
      )}

      {/* Mostrar ubicación obtenida */}
      {ubicacion && !errorGPS && (
        <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl">
          <p className="text-blue-200 font-medium mb-2">📍 Ubicación obtenida:</p>
          <p className="text-blue-200/80 text-sm font-mono">
            Latitud: {ubicacion.lat.toFixed(6)}<br />
            Longitud: {ubicacion.lng.toFixed(6)}
          </p>
          <p className="text-blue-300/70 text-xs mt-2">
            ✅ Esta ubicación se enviará con tu reporte
          </p>
        </div>
      )}

      {/* Separador */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900/50 text-gray-400">O escribe tu dirección</span>
        </div>
      </div>

      {/* Campo alternativo para dirección manual */}
      <div>
        <label className="block text-white font-medium mb-2">
          Dirección manual (alternativa)
        </label>
        <input
          type="text"
          value={direccionManual}
          onChange={handleDireccionManual}
          placeholder="Ej: Av. Libertad 123, Villa María"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
        />
        <p className="text-gray-400 text-xs mt-1">
          Si no puedes usar el GPS, escribe tu dirección manualmente
        </p>
      </div>

      {/* Instrucciones para el usuario */}
      <div className="mt-4 p-4 bg-white/5 rounded-xl">
        <p className="text-gray-300 text-sm font-medium mb-2">📱 Consejos:</p>
        <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
          <li>Activa el GPS en tu celular antes de usar el botón</li>
          <li>Permite el acceso a la ubicación cuando el navegador lo solicite</li>
          <li>Para mejor precisión, asegúrate de estar al aire libre</li>
          <li>Si el GPS no funciona, usa la dirección manual</li>
        </ul>
      </div>
    </div>
  );
};

export default MapaIncidente;