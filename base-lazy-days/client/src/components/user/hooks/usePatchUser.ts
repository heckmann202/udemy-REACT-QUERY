import jsonpatch from "fast-json-patch";

import type { User } from "@shared/types";

import { axiosInstance, getJWTHeader } from "../../../axiosInstance";
import { useUser } from "./useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";

export const MUTATION_KEY = 'patch-user'

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
 ): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData.token),
    },
  );
  return data.user;
 }

export function usePatchUser() {
  const toast = useCustomToast()
  const { user } = useUser();
  const queryClient = useQueryClient()

  // TODO: replace with mutate function
  const {mutate: patchUser} = useMutation({
    mutationKey: [MUTATION_KEY],
    mutationFn: (newData: User) => patchUserOnServer(newData, user),
    onSuccess: (userData: User | null) => {
      toast({title: 'User updated!', status: 'success'})
    },
    onSettled: () => {
      // return promise to maintain 'inProgress' status until query invalidation is complete
      queryClient.invalidateQueries({queryKey: [queryKeys.user]})
    }
  })

  return patchUser;
}
