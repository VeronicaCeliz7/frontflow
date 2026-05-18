import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateIncident() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      console.log(`Actualizando incidente ${id} a: ${status}`)
      return { id, status }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] })
    },
  })
}