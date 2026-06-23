const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}`;

async function apiGet(path: string) {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Error al consultar ${path}`);
  }

  return response.json();
}

export const getSuperDashboard = () => apiGet('/api/super/dashboard');
export const getSuperClientes = () => apiGet('/api/super/clientes');
export const getSuperUsuarios = () => apiGet('/api/super/usuarios');
export const getSuperReportes = () => apiGet('/api/super/reportes');
export const getIAHeatmap = () => apiGet('/api/ia/heatmap');
