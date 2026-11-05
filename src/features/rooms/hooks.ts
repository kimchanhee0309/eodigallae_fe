"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createRoom, getRoomDetail, joinRoom, rotateRoomInvite } from "./api";
import { rememberRecentRoom } from "./recent-rooms";

import type { JoinRoomInput } from "./types";

export function useCreateRoom() {
  return useMutation({
    mutationFn: createRoom,

    onSuccess: (data) => {
      rememberRecentRoom(data.room);
    },

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

export function useJoinRoom(roomId: string) {
  return useMutation({
    mutationFn: (input: JoinRoomInput) => joinRoom(roomId, input),

    onSuccess: (data) => {
      rememberRecentRoom(data.room);
    },

    retry: false,
    gcTime: 0,
  });
}

export function useRotateRoomInvite(roomId: string) {
  return useMutation({
    mutationFn: () => rotateRoomInvite(roomId),

    retry: false,
    gcTime: 0,
  });
}
