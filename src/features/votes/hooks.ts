"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api-client";

import { getVotes, setVote } from "./api";
import { votesKey } from "./keys";

import type { SetVoteInput } from "./schemas";

export function useVotes(roomId: string) {
  return useQuery({
    queryKey: votesKey(roomId),
    queryFn: ({ signal }) => getVotes(roomId, signal),

    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useSetVote(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SetVoteInput) => setVote(roomId, input),

    retry: false,
    gcTime: 0,

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: votesKey(roomId),
        exact: true,
      });
    },

    onSuccess: async (result) => {
      await queryClient.cancelQueries({
        queryKey: votesKey(roomId),
        exact: true,
      });

      queryClient.setQueryData(votesKey(roomId), result);
    },

    onError: async (error) => {
      if (error instanceof ApiError && error.code === "ROOM_CLOSED") {
        await queryClient.invalidateQueries({
          queryKey: ["rooms", "detail", roomId],
          exact: true,
        });
      }
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: votesKey(roomId),
        exact: true,
      });
    },
  });
}
