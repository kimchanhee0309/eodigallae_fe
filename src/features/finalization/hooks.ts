"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { votesKey } from "@/features/votes/keys";
import type { RoomDetailData } from "@/features/rooms/schemas";

import { finalizeRoom } from "./api";

export function useFinalizeRoom(roomId: string) {
  const queryClient = useQueryClient();
  const detailKey = ["rooms", "detail", roomId] as const;

  return useMutation({
    mutationFn: (candidateId: string) => finalizeRoom(roomId, candidateId),

    retry: false,
    gcTime: 0,

    onSuccess: async (result) => {
      await queryClient.cancelQueries({
        queryKey: detailKey,
        exact: true,
      });

      queryClient.setQueryData<RoomDetailData>(detailKey, (previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,

          room: {
            ...previous.room,
            status: result.status,
            finalizedAt: result.finalizedAt,
            finalizedCandidate: result.finalizedCandidate,
          },
        };
      });
    },

    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: detailKey,
          exact: true,
        }),

        queryClient.invalidateQueries({
          queryKey: ["rooms", "candidates", roomId],
          exact: true,
        }),

        queryClient.invalidateQueries({
          queryKey: votesKey(roomId),
          exact: true,
        }),
      ]);
    },
  });
}
