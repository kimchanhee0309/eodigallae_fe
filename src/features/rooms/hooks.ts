"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createRoom, getRoomDetail } from "./api";

export function useCreateRoom() {
  return useMutation({
    mutationFn: createRoom,
    retry: false,
    gcTime: 0,
  });
}

export function useRoomDetail(roomId: string) {
  return useQuery({
    queryKey: ["rooms", "detail", roomId],

    queryFn: ({ signal }) => getRoomDetail(roomId, signal),

    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}
