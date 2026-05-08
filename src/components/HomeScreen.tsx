import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const HomeScreen = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-6">
      {/* Logo + texto */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
          <span className="text-white text-3xl font-bold">UF</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">
            <span className="text-white">URBAN</span>
            <span className="text-blue-500">FLOW</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Reporta incidencias en tu ciudad
          </p>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/nuevo-reporte')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition text-lg"
        >
          📝 Nuevo Reporte
        </button>
        
        <button
          onClick={() => navigate('/mis-reportes')}
          className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition text-lg"
        >
          📋 Mis Reportes
        </button>
      </div>
      
      {/* Información del usuario */}
      <div className="mt-8 p-4 bg-white/5 rounded-xl">
        <p className="text-gray-400 text-sm">
          Conectado como: <span className="text-white">{userId?.slice(0, 8)}...</span>
        </p>
      </div>
      
      <p className="text-gray-500 text-xs text-center mt-4">
        UrbanFlow - Reportes ciudadanos
      </p>
    </div>
  );
};

export default HomeScreen;