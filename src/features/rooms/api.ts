import { postJson, getJson } from "@/lib/api-client";

import {
  createRoomResponseSchema,
  roomDetailResponseSchema,
  joinRoomResponseSchema,
  rotateInviteResponseSchema,
} from "./schemas";
import type { CreateRoomInput, JoinRoomInput } from "./types";

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

export async function joinRoom(roomId: string, input: JoinRoomInput) {
  const response = await postJson(
    `/api/rooms/${encodeURIComponent(roomId)}/join`,
    input,
    joinRoomResponseSchema,
  );

  return response.data;
}

export async function rotateRoomInvite(roomId: string) {
  const response = await postJson(
    `/api/rooms/${encodeURIComponent(roomId)}/invite/rotate`,
    {},
    rotateInviteResponseSchema,
  );

  return response.data;
}
