import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ============ SINCRONIZACIÓN DE USUARIO ============

// Obtener el token de Clerk y sincronizar usuario con MongoDB
export const syncUserWithBackend = async (user: any) => {
  try {
    const token = await user.getToken();
    
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Usuario sincronizado con MongoDB:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al sincronizar usuario:', error);
    throw error;
  }
};

// ============ REPORTES API ============

export interface CreateReporteDto {
  titulo: string;
  columna_unica: string;
  direccion: string;
  latitud: number;
  longitud: number;
  observaciones?: string;
  fecha_hora: Date;
  archivo_url?: string;
  archivo_public_id?: string;
  archivo_tipo?: 'image' | 'video';
}

export interface Reporte {
  _id: string;
  usuarioId: string;
  usuarioEmail: string;
  titulo: string;
  columna_unica: string;
  direccion: string;
  latitud: number;
  longitud: number;
  observaciones?: string;
  archivo_url?: string;
  archivo_public_id?: string;
  archivo_tipo?: 'image' | 'video';
  categoria_asignada_por_ia?: string;
  ia_procesado: boolean;
  estado: 'pendiente' | 'en_proceso' | 'resuelto' | 'rechazado';
  fecha_hora: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Hook personalizado para reportes
export const useReporteApi = () => {
  const { getToken } = useAuth();

  const crearReporte = async (data: CreateReporteDto): Promise<Reporte> => {
    const token = await getToken();
    
    const response = await axios.post(`${API_URL}/reportes`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error);
    }
    
    return response.data.data;
  };

  const obtenerMisReportes = async (): Promise<Reporte[]> => {
    const token = await getToken();
    
    const response = await axios.get(`${API_URL}/reportes/mis-reportes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data.data || [];
  };

  const obtenerTodosReportes = async (): Promise<Reporte[]> => {
    const response = await axios.get(`${API_URL}/reportes`);
    return response.data.data || [];
  };

  return {
    crearReporte,
    obtenerMisReportes,
    obtenerTodosReportes,
  };
};