import { useQuery, UseQueryResult, useMutation } from "@tanstack/react-query";
import { fetchAuthUser } from "../Services/authService";
import { AuthUser } from "@/common/Interfaces/AuthUser.d";

export function useLoginUser(email: string, password: string) {
  return useMutation<AuthUser, Error>({
    mutationFn: async () => {   
      const user = await fetchAuthUser(email, password);
      return user;
    },
  });
}

export function useAuthUser(email: string, password: string): UseQueryResult<AuthUser, Error> {
  return useQuery<AuthUser, Error>({
    queryKey: ['auth'],
    queryFn: () => fetchAuthUser(email, password),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}



