import { getJson, postJson } from "@/lib/api-client";

import {
  candidatesResponseSchema,
  createCandidateResponseSchema,
} from "./schemas";

import type { CreateCandidateInput } from "./schemas";

export async function getCandidates(roomId: string, signal?: AbortSignal) {
  const response = await getJson(
    `/api/rooms/${encodeURIComponent(roomId)}/candidates`,
    candidatesResponseSchema,
    signal,
  );

  return response.data.candidates;
}

export async function createCandidate(
  roomId: string,
  input: CreateCandidateInput,
) {
  const response = await postJson(
    `/api/rooms/${encodeURIComponent(roomId)}/candidates`,
    input,
    createCandidateResponseSchema,
  );

  return response.data.candidate;
}
