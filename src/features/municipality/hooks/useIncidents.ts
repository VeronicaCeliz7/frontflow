import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { getIncidents } from '../services/municipalityApi'

export function useIncidents(filters = {}) {
  const { getToken } = useAuth()

  return useQuery({
    queryKey: ['incidents', filters],

    queryFn: async () => {
      const token = await getToken()

      if (!token) {
        throw new Error('Token no encontrado')
      }

      return getIncidents(token, filters)
    }
  })
}