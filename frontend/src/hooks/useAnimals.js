import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { animalApi } from '@/api/animalApi';
import { toast } from '@/hooks/useToast';

const QUERY_KEY = 'animals';

export function useAnimals(params = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn:  () => animalApi.list(params).then((r) => r.data),
  });
}

export function useAnimal(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn:  () => animalApi.get(id).then((r) => r.data),
    enabled:  !!id,
  });
}

export function useCreateAnimal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => animalApi.create(data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries([QUERY_KEY]);
      toast.success('Animal added successfully');
    },
  });
}

export function useUpdateAnimal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => animalApi.update(id, data).then((r) => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries([QUERY_KEY]);
      qc.invalidateQueries([QUERY_KEY, id]);
      toast.success('Animal updated');
    },
  });
}

export function useDeleteAnimal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => animalApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries([QUERY_KEY]);
      toast.success('Animal removed');
    },
  });
}
