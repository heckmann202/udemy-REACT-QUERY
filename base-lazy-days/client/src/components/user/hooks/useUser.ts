import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { generateUserKey } from "@/react-query/key-factories";
import { queryKeys } from "@/react-query/constants";

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

export function useUser() {

  const queryClient = useQueryClient()

  const {userId, userToken} = useLoginData()
  // call useQuery to update user data from server
  const {data: user} = useQuery({
    enabled: !!userId,
    queryKey: generateUserKey(userId, userToken),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity
  })

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    queryClient.setQueryData(
      generateUserKey(newUser.id, newUser.token),
      newUser
    )
  }

  // meant to be called from useAuth
  function clearUser() {
    // remove user data
    queryClient.removeQueries({
      queryKey: [queryKeys.user]
    })
    // remove user appointment data
    queryClient.removeQueries({
      queryKey: [queryKeys.appointments, queryKeys.user]
    })
  }

  return { user, updateUser, clearUser };
}
