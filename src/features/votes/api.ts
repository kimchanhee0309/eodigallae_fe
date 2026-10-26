import { getJson, postJson } from "@/lib/api-client";

import { setVoteInputSchema, votesResponseSchema } from "./schemas";

import type { SetVoteInput } from "./schemas";

export async function getVotes(roomId: string, signal?: AbortSignal) {
  const response = await getJson(
    `/api/rooms/${encodeURIComponent(roomId)}/votes`,
    votesResponseSchema,
    signal,
  );

  return response.data;
}

export async function setVote(roomId: string, input: SetVoteInput) {
  const response = await postJson(
    `/api/rooms/${encodeURIComponent(roomId)}/votes`,
    setVoteInputSchema.parse(input),
    votesResponseSchema,
  );

  return response.data;
}
