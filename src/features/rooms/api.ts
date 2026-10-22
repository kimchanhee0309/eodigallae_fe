import { postJson, getJson } from "@/lib/api-client";

import { createRoomResponseSchema, roomDetailResponseSchema } from "./schemas";
import type { CreateRoomInput } from "./types";

export async function createRoom(input: CreateRoomInput) {
  const response = await postJson(
    "/api/rooms",
    input,
    createRoomResponseSchema,
  );

  return response.data;
}

export async function getRoomDetail(roomId: string, signal?: AbortSignal) {
  const response = await getJson(
    `/api/rooms/${encodeURIComponent(roomId)}`,
    roomDetailResponseSchema,
    signal,
  );

  return response.data;
}
