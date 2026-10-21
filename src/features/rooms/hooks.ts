"use client";

import { useMutation } from "@tanstack/react-query";
import { createRoom } from "./api";

export function useCreateRoom() {
  return useMutation({
    mutationFn: createRoom,
    retry: false,
    gcTime: 0,
  });
}
