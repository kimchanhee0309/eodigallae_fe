import { postJson } from "@/lib/api-client";

import { finalizeRoomResponseSchema } from "./schemas";

export async function finalizeRoom(roomId: string, candidateId: string) {
  const response = await postJson(
    `/api/rooms/${encodeURIComponent(roomId)}/finalize`,
    { candidateId },
    finalizeRoomResponseSchema,
  );

  return response.data;
}
