"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type UseGrpcMutationOptions<TData, TVariables> = {
  mutationFn: (variables: TVariables, accessToken?: string | null) => Promise<TData>;
} & Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">;

export function useGrpcMutation<TData, TVariables extends object>(
  options: UseGrpcMutationOptions<TData, TVariables>,
) {
  const { data: session } = useSession();
  const { mutationFn, ...rest } = options;

  return useMutation({
    ...rest,
    mutationFn: async (variables: TVariables) =>
      mutationFn(variables, session?.accessToken),
  });
}
