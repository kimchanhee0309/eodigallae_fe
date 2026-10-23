import type { CreateRoomErrors, CreateRoomInput } from "./types";
import { z } from "zod";

export function normalizeCreateRoomInput(
  input: CreateRoomInput,
): CreateRoomInput {
  return {
    name: input.name.trim(),
    hostNickname: input.hostNickname.trim(),
    description: input.description.trim(),
  };
}

export function validateCreateRoomInput(
  input: CreateRoomInput,
): CreateRoomErrors {
  const errors: CreateRoomErrors = {};

  if (input.name.length < 2 || input.name.length > 40) {
    errors.name = "모임 이름을 2~40자로 입력해주세요.";
  }

  if (input.hostNickname.length < 2 || input.hostNickname.length > 12) {
    errors.hostNickname = "닉네임을 2~12자로 입력해주세요.";
  }

  if (input.description.length > 300) {
    errors.description = "설명은 300자 이내로 입력해주세요.";
  }

  return errors;
}

export const createRoomResponseSchema = z.object({
  data: z.object({
    room: z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      status: z.enum(["OPEN", "FINALIZED"]),
      createdAt: z.string().datetime(),
    }),

    participant: z.object({
      id: z.string().uuid(),
      nickname: z.string(),
      role: z.literal("HOST"),
    }),

    inviteUrl: z.string().url(),
  }),
});

export const roomDetailResponseSchema = z.object({
  data: z.object({
    room: z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      status: z.enum(["OPEN", "FINALIZED"]),
      createdAt: z.string().datetime(),
      participantCount: z.number().int().nonnegative(),
    }),

    me: z.object({
      id: z.string().uuid(),
      nickname: z.string(),
      role: z.enum(["HOST", "MEMBER"]),
    }),
  }),
});

export const joinRoomInputSchema = z.strictObject({
  nickname: z
    .string()
    .trim()
    .min(2, "닉네임을 2자 이상 입력해주세요.")
    .max(12, "닉네임은 12자 이내로 입력해주세요."),

  inviteToken: z
    .string()
    .regex(/^[A-Za-z0-9_-]{43}$/, "올바른 초대 링크가 아닙니다."),
});

export const joinRoomResponseSchema = z.object({
  data: z.object({
    room: z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      status: z.enum(["OPEN", "FINALIZED"]),
      createdAt: z.string().datetime(),
    }),

    participant: z.object({
      id: z.string().uuid(),
      nickname: z.string(),
      role: z.enum(["HOST", "MEMBER"]),
    }),
  }),
});

export const rotateInviteResponseSchema = z.object({
  data: z.object({
    inviteUrl: z.string().url(),
  }),
});
