// src/utils/colorStrategy.ts
import { normalizeRawKey } from './formatters';

export type SemanticDomain = 'categoria' | 'estado' | 'prioridad';

interface ColorStrategy {
  resolve(key: string): string;
}

const PALETA_CATEGORIAS = [
  '#2563eb', // azul
  '#0d9488', // verde azulado
  '#7c3aed', // violeta
  '#d97706', // ámbar oscuro
  '#db2777', // rosa
  '#0284c7', // celeste
  '#4f46e5', // índigo
  '#65a30d', // lima oscuro
];

function hashKey(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const categoriaStrategy: ColorStrategy = {
  resolve(key: string): string {
    const index = hashKey(key) % PALETA_CATEGORIAS.length;
    return PALETA_CATEGORIAS[index];
  },
};

const estadoStrategy: ColorStrategy = {
  resolve(key: string): string {
    switch (key) {
      case 'resuelto':
      case 'verificado':
      case 'cerrado':
        return '#16a34a'; // verde: completado / cerrado
      case 'en_proceso':
      case 'asignado':
        return '#2563eb'; // azul: gestión activa
      case 'aceptado':
      case 'validacion_inicial':
      case 'reportado':
      case 'pendiente':
        return '#d97706'; // ámbar: en revisión / pendiente de acción
      case 'informacion_insuficiente':
      case 'duplicado':
        return '#7c3aed'; // violeta: observación / revisión de datos
      case 'rechazado':
      case 'fuera_de_jurisdiccion':
        return '#dc2626'; // rojo: rechazado / fuera de alcance
      default:
        return '#64748b'; // gris neutro para cualquier estado futuro
    }
  },
};

const prioridadStrategy: ColorStrategy = {
  resolve(key: string): string {
    switch (key) {
      case 'critica':
        return '#dc2626';
      case 'alta':
        return '#ea580c';
      case 'media':
        return '#d97706';
      case 'baja':
        return '#0284c7';
      default:
        return '#64748b';
    }
  },
};

const strategiesByDomain: Record<SemanticDomain, ColorStrategy> = {
  categoria: categoriaStrategy,
  estado: estadoStrategy,
  prioridad: prioridadStrategy,
};

export function getSemanticColor(domain: SemanticDomain, rawKey?: string | null): string {
  const normalizedKey = normalizeRawKey(rawKey);
  const strategy = strategiesByDomain[domain] || categoriaStrategy;
  return strategy.resolve(normalizedKey);
}