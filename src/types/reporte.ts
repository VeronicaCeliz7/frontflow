export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface Ubicacion {
  direccion: string;
  coordenadas: Coordenadas;
}

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