import { z } from "zod";

import { candidateSchema } from "@/features/candidates/schemas";

export const finalizedCandidateSchema = candidateSchema.pick({
  id: true,
  name: true,
  address: true,
  mapUrl: true,
  memo: true,
});

export const finalizeRoomResponseSchema = z.object({
  data: z.object({
    roomId: z.string().uuid(),
    status: z.literal("FINALIZED"),
    finalizedAt: z.string().datetime(),
    finalizedCandidate: finalizedCandidateSchema,
  }),
});

export type FinalizedCandidate = z.infer<typeof finalizedCandidateSchema>;
