import { z } from "zod";

export const setVoteInputSchema = z.strictObject({
  candidateId: z.string().uuid().nullable(),
});

export const votesResponseSchema = z.object({
  data: z.object({
    myCandidateId: z.string().uuid().nullable(),

    totalVotes: z.number().int().nonnegative(),

    candidates: z
      .array(
        z.object({
          candidateId: z.string().uuid(),
          voteCount: z.number().int().nonnegative(),
        }),
      )
      .max(50),
  }),
});

export type SetVoteInput = z.infer<typeof setVoteInputSchema>;
