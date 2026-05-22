const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function apiGet(path: string) {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Error al consultar ${path}`);
  }

  return response.json();
}

export const getSuperDashboard = () => apiGet('/super/dashboard');
export const getSuperClientes = () => apiGet('/super/clientes');
export const getSuperUsuarios = () => apiGet('/super/usuarios');
export const getSuperReportes = () => apiGet('/super/reportes');