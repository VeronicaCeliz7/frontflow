import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const getAuthHeaders = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` }
})

export const getDashboardStats = async (token: string) => {
  const { data } = await axios.get(`${API_URL}/api/reportes/stats`, getAuthHeaders(token))
  return data
}

export const getIncidents = async (
  token: string,
  filters: Record<string, string> = {}
) => {
  const params = new URLSearchParams()

  if (filters.estado) params.append('estado', filters.estado)
  if (filters.status) params.append('estado', filters.status)

  if (filters.municipio) params.append('municipio', filters.municipio)
  if (filters.operadorId) params.append('operadorId', filters.operadorId)
  if (filters.sinAsignar) params.append('sinAsignar', filters.sinAsignar)

  if (filters.categoria) params.append('categoria', filters.categoria)
  if (filters.page) params.append('page', filters.page)

  params.append('limit', filters.limit || '10')

  const { data } = await axios.get(
    `${API_URL}/api/reportes?${params.toString()}`,
    getAuthHeaders(token)
  )

  return data
}

export const takeIncident = async (token: string, id: string) => {
  const { data } = await axios.patch(
    `${API_URL}/api/reportes/${id}/tomar`,
    {},
    getAuthHeaders(token)
  )

  return data
}

export const updateIncidentStatus = async (token: string, { id, status }: { id: string, status: string }) => {
  const { data } = await axios.put(`${API_URL}/api/reportes/${id}`, { estado: status }, getAuthHeaders(token))
  return data
}