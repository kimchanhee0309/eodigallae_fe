"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api-client";

import { createCandidate, getCandidates } from "./api";
import type { CreateCandidateInput } from "./schemas";

function candidatesKey(roomId: string) {
  return ["rooms", "candidates", roomId] as const;
}

export function useCandidates(roomId: string) {
  return useQuery({
    queryKey: candidatesKey(roomId),
    queryFn: ({ signal }) => getCandidates(roomId, signal),

    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });
}

export function useCreateCandidate(roomId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCandidateInput) => createCandidate(roomId, input),

    retry: false,
    gcTime: 0,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: candidatesKey(roomId),
        exact: true,
      });
    },

    onError: async (error) => {
      if (error instanceof ApiError && error.code === "ROOM_CLOSED") {
        await queryClient.invalidateQueries({
          queryKey: ["rooms", "detail", roomId],
          exact: true,
        });
      }
    },
  });
}
