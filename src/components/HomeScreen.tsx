import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import UrbanFlowLogo from './UrbanFlowLogo';
import { FaPlus, FaList } from 'react-icons/fa';

const HomeScreen = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-6">
      {/* Logo centrado */}
      <div className="flex justify-center">
        <UrbanFlowLogo size="large" showText={true} />
      </div>
      
      {/* Botones de acción - solo colores ajustados */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate('/nuevo-reporte')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition text-lg flex items-center justify-center gap-3"
        >
          <FaPlus />
          Nuevo Reporte
        </button>
        
        <button
          onClick={() => navigate('/mis-reportes')}
          className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition text-lg flex items-center justify-center gap-3"
        >
          <FaList />
          Mis Reportes
        </button>
      </div>
      
      {/* Información del usuario - colores ajustados */}
      <div className="mt-8 p-4 bg-gray-100 rounded-xl">
        <p className="text-gray-600 text-sm">
          Conectado como: <span className="text-gray-800">{userId?.slice(0, 8)}...</span>
        </p>
      </div>
      
      <p className="text-gray-400 text-xs text-center mt-4">
        UrbanFlow - Reportes ciudadanos
      </p>
    </div>
  );
};

export default HomeScreen;