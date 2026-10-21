import { postJson } from "@/lib/api-client";

import { createRoomResponseSchema } from "./schemas";
import type { CreateRoomInput } from "./types";

export async function createRoom(input: CreateRoomInput) {
  const response = await postJson(
    "/api/rooms",
    input,
    createRoomResponseSchema,
  );

  return response.data;
}
