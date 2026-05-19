const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getSuperDashboard() {
  const response = await fetch(`${API_URL}/super/dashboard`);

  if (!response.ok) {
    throw new Error('Error al obtener dashboard de super usuario');
  }

  return response.json();
}