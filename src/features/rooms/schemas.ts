import type { CreateRoomErrors, CreateRoomInput } from "./types";

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
