// Definición de categorías con sus colores
export const CATEGORIAS = {
  bache: {
    nombre: 'Bache',
    emoji: '🕳️',
    color: '#EF4444', // Rojo
    colorClaro: '#FEE2E2',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-400'
  },
  semaforo: {
    nombre: 'Semáforo',
    emoji: '🚦',
    color: '#F59E0B', // Amarillo
    colorClaro: '#FEF3C7',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
    textColor: 'text-yellow-400'
  },
  iluminacion: {
    nombre: 'Iluminación',
    emoji: '💡',
    color: '#3B82F6', // Azul
    colorClaro: '#DBEAFE',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/50',
    textColor: 'text-blue-400'
  },
  basura: {
    nombre: 'Basura',
    emoji: '🗑️',
    color: '#10B981', // Verde
    colorClaro: '#D1FAE5',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
    textColor: 'text-green-400'
  },
  seguridad: {
    nombre: 'Seguridad',
    emoji: '👮',
    color: '#1F2937', // Negro/Gris
    colorClaro: '#E5E7EB',
    bgColor: 'bg-gray-700/50',
    borderColor: 'border-gray-500/50',
    textColor: 'text-gray-300'
  },
  otros: {
    nombre: 'Otros',
    emoji: '📌',
    color: '#8B5CF6', // Morado
    colorClaro: '#EDE9FE',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
    textColor: 'text-purple-400'
  }
};

// Array para selects y listas
export const CATEGORIAS_LIST = Object.entries(CATEGORIAS).map(([value, data]) => ({
  value,
  ...data
}));

// Función para obtener el color según categoría
export const getColorByCategoria = (categoria: string): string => {
  return CATEGORIAS[categoria as keyof typeof CATEGORIAS]?.color || '#6B7280';
};

// Función para obtener el nombre según categoría
export const getNombreCategoria = (categoria: string): string => {
  return CATEGORIAS[categoria as keyof typeof CATEGORIAS]?.nombre || 'Otros';
};