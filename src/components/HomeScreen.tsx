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
      
      {/* Botones de acción */}
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
          className="w-full py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition text-lg flex items-center justify-center gap-3"
        >
          <FaList />
          Mis Reportes
        </button>
      </div>
      
      {/* Información del usuario */}
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Conectado como: <span className="text-gray-800 dark:text-gray-200">{userId?.slice(0, 8)}...</span>
        </p>
      </div>
      
      <p className="text-gray-400 dark:text-gray-500 text-xs text-center mt-4">
        UrbanFlow - Reportes ciudadanos
      </p>
    </div>
  );
};

export default HomeScreen;