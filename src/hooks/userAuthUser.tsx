import { useQuery, UseQueryResult, useMutation } from "@tanstack/react-query";
import { fetchAuthUser } from "../Services/authService";
import { AuthUser } from "@/common/Interfaces/AuthUser.d";

export function useLoginUser(username: string, password: string) {
  return useMutation<AuthUser, Error>({
    mutationFn: async () => {   
      const user = await fetchAuthUser(username, password);
      return user;
    },
  });
}

export function useAuthUser(username: string, password: string): UseQueryResult<AuthUser, Error> {
  return useQuery<AuthUser, Error>({
    queryKey: ['auth'],
    queryFn: () => fetchAuthUser(username, password),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}



