import {IUser} from "@/constants";
import {
  QueryClient,
  useMutation,
  UseMutationResult,
  useQueryClient
} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {useRouter} from "next/navigation";

import {API} from "@/libs/rest";

interface LogoutProps {
  token?: string
}

export const useLogout = (
): UseMutationResult<null, AxiosError, LogoutProps> => {
  const queryClient: QueryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    let user: IUser | undefined = queryClient.getQueryData(['user']);
    let token: string | undefined = queryClient.getQueryData(['token']);
    if (user) {
      queryClient.setQueryData(['user'], undefined);
      sessionStorage.removeItem('USER');
      console.log(`Successfully logged out user ${user.name}`);
    }
    if (token) {
      queryClient.setQueryData(['token'], undefined);
      sessionStorage.removeItem('TOKEN');
    }
    router.push('/')
  }

  return useMutation({
    mutationFn: ({token}: LogoutProps) => API.delete(
      `/login`,
      {headers: {Authorization: `Bearer ${token}`}}
    ).then(() => null),
    onSuccess: () => handleLogout(),
    onError: () => handleLogout()
  })
}
