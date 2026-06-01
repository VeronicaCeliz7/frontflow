import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { updateIncidentStatus } from '../services/municipalityApi'

export function useUpdateIncident() {
  const queryClient = useQueryClient()
  const { getToken } = useAuth()

  return useMutation({
    mutationFn: async ({
      id,
      status
    }: {
      id: string
      status: string
    }) => {
      const token = await getToken()

      if (!token) {
        throw new Error('No se pudo obtener el token')
      }

      return updateIncidentStatus(token, {
        id,
        status
      })
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['incidents']
      })
    }
  })
}