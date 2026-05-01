// src/components/HomeScreen.tsx
import { useAuth, useClerk } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import UrbanFlowLogo from './UrbanFlowLogo';

const HomeScreen = () => {
  const { getToken, userId } = useAuth();
  const { signOut } = useClerk();
  const [cargando, setCargando] = useState(false);
  const [reportes, setReportes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoReporte, setNuevoReporte] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'pozo',
    lat: 0,
    lng: 0
  });

  const cargarReportes = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:3000/api/reportes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setReportes(data);
    } catch (error) {
      console.error("Error al cargar reportes:", error);
    }
  };

  const crearReporte = async () => {
    setCargando(true);
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:3000/api/reportes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoReporte)
      });
      
      if (response.ok) {
        setMostrarModal(false);
        setNuevoReporte({ titulo: '', descripcion: '', tipo: 'pozo', lat: 0, lng: 0 });
        cargarReportes();
      }
    } catch (error) {
      console.error("Error al crear reporte:", error);
    } finally {
      setCargando(false);
    }
  };

  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setNuevoReporte({
          ...nuevoReporte,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  };

  useEffect(() => {
    cargarReportes();
    obtenerUbicacion();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <UrbanFlowLogo size="small" />
            <span className="text-white font-semibold">UrbanFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm">ID: {userId?.slice(0, 8)}...</span>
            <button
              onClick={() => signOut()}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <div className="relative h-[50vh] bg-gray-800 m-4 rounded-xl overflow-hidden border border-white/10">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-gray-400">Mapa de Google Maps</p>
              <p className="text-gray-500 text-sm mt-2">Próximamente: integración con mapas</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMostrarModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center transition z-10"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <div className="container mx-auto px-4 py-6">
          <h3 className="text-white font-semibold mb-4">Reportes cercanos</h3>
          <div className="space-y-3">
            {reportes.length === 0 ? (
              <p className="text-gray-400 text-sm">No hay reportes cercanos</p>
            ) : (
              reportes.map((reporte: any, index: number) => (
                <div key={index} className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">{reporte.titulo}</h4>
                      <p className="text-gray-400 text-sm">{reporte.descripcion}</p>
                      <p className="text-gray-500 text-xs mt-1">Tipo: {reporte.tipo}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                      pendiente
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-white text-xl font-semibold mb-4">Nuevo reporte</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1">Tipo de incidente</label>
                <select
                  value={nuevoReporte.tipo}
                  onChange={(e) => setNuevoReporte({...nuevoReporte, tipo: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                >
                  <option value="pozo">Pozo / Bache</option>
                  <option value="caño">Caño roto / Fuga de agua</option>
                  <option value="luz">Luminaria rota</option>
                  <option value="basura">Basura acumulada</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm block mb-1">Título</label>
                <input
                  type="text"
                  value={nuevoReporte.titulo}
                  onChange={(e) => setNuevoReporte({...nuevoReporte, titulo: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                  placeholder="Ej: Pozo peligroso en..."
                />
              </div>
              
              <div>
                <label className="text-gray-300 text-sm block mb-1">Descripción</label>
                <textarea
                  value={nuevoReporte.descripcion}
                  onChange={(e) => setNuevoReporte({...nuevoReporte, descripcion: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white"
                  rows={3}
                  placeholder="Describe el problema..."
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={crearReporte}
                  disabled={cargando}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition disabled:opacity-50"
                >
                  {cargando ? 'Enviando...' : 'Reportar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;