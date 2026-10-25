import { z } from "zod";

const webUrlSchema = z
  .string()
  .trim()
  .max(2000, "지도 링크는 2,000자 이내로 입력해주세요.")
  .pipe(
    z.url({
      protocol: /^https?$/,
      error: "http 또는 https 주소를 입력해주세요.",
    }),
  )
  .refine((value) => {
    try {
      const url = new URL(value);

      return url.username === "" && url.password === "";
    } catch {
      return false;
    }
  }, "사용자 정보가 포함되지 않은 올바른 주소를 입력해주세요.");

export const createCandidateInputSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(1, "장소명을 입력해주세요.")
    .max(100, "장소명은 100자 이내로 입력해주세요."),

  address: z
    .string()
    .trim()
    .min(1, "주소를 입력해주세요.")
    .max(200, "주소는 200자 이내로 입력해주세요."),

  mapUrl: z
    .preprocess((value) => {
      if (typeof value === "string" && value.trim() === "") {
        return null;
      }

      return value;
    }, webUrlSchema.nullable())
    .optional()
    .transform((value) => value ?? null),

  memo: z
    .string()
    .trim()
    .max(300, "추천 이유는 300자 이내로 입력해주세요.")
    .default(""),
});

export const candidateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  address: z.string(),
  mapUrl: webUrlSchema.nullable(),
  memo: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),

  createdBy: z.object({
    id: z.string().uuid(),
    nickname: z.string(),
  }),
});

export const createCandidateResponseSchema = z.object({
  data: z.object({
    candidate: candidateSchema,
  }),
});

export const candidatesResponseSchema = z.object({
  data: z.object({
    candidates: z.array(candidateSchema).max(50),
  }),
});

export type CreateCandidateInput = z.infer<typeof createCandidateInputSchema>;
