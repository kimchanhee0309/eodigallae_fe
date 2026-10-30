"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";

import { useRetryCooldown } from "@/hooks/use-retry-cooldown";
import { ApiError } from "@/lib/api-client";

import { useJoinRoom } from "../hooks";
import { joinRoomInputSchema } from "../schemas";

type JoinRoomFormProps = {
  roomId: string;
  inviteToken: string;
  onJoined: () => void;
};

export default function JoinRoomForm({
  roomId,
  inviteToken,
  onJoined,
}: JoinRoomFormProps) {
  const [nickname, setNickname] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const submittingRef = useRef(false);

  const mutation = useJoinRoom(roomId);
  const cooldown = useRetryCooldown();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current || mutation.isSuccess || !cooldown.canSubmit()) {
      return;
    }

    const result = joinRoomInputSchema.safeParse({
      nickname,
      inviteToken,
    });

    if (!result.success) {
      setValidationError(
        result.error.issues[0]?.message ?? "입력 내용을 확인해주세요.",
      );
      return;
    }

    setValidationError(null);
    submittingRef.current = true;

    try {
      await mutation.mutateAsync(result.data);
      onJoined();
    } catch (error) {
      cooldown.startCooldown(error);
    } finally {
      submittingRef.current = false;
    }
  }

  if (mutation.isSuccess) {
    return (
      <p
        role="status"
        className="rounded-3xl border border-border bg-surface p-8"
      >
        참여가 완료됐어요. 모임 정보를 불러오고 있어요.
      </p>
    );
  }

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
      <p className="text-sm font-bold text-brand">새로운 약속에 초대됐어요</p>

      <h1 className="mt-3 text-3xl font-extrabold">함께 골라볼까요?</h1>

      <p className="mt-4 leading-7 text-muted">
        친구들에게 표시할 닉네임을 입력해주세요. 회원가입 없이 참여할 수 있어요.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={mutation.isPending}
        className="mt-8"
      >
        <fieldset disabled={mutation.isPending}>
          <label htmlFor="join-nickname" className="text-sm font-bold">
            내 닉네임
          </label>

          <input
            id="join-nickname"
            name="nickname"
            type="text"
            autoComplete="nickname"
            required
            maxLength={12}
            value={nickname}
            onChange={(event) => {
              setNickname(event.target.value);
              setValidationError(null);

              // 오류 메시지를 지워도 대기 시간은 유지됩니다.
              if (mutation.isError) {
                mutation.reset();
              }
            }}
            placeholder="예: 여행대장"
            aria-invalid={Boolean(validationError)}
            aria-describedby={
              validationError ? "join-validation-error" : undefined
            }
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3"
          />

          {validationError && (
            <p
              id="join-validation-error"
              role="alert"
              className="mt-3 text-sm text-red-700"
            >
              {validationError}
            </p>
          )}

          {mutation.isError && (
            <p
              role="alert"
              className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700"
            >
              {mutation.error instanceof ApiError
                ? mutation.error.message
                : "모임에 참여하지 못했습니다."}
            </p>
          )}

          {cooldown.isCoolingDown && (
            <p
              id="join-retry-wait"
              className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm text-orange-800"
            >
              {cooldown.remainingSeconds}초 후 다시 시도할 수 있어요.
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending || cooldown.isCoolingDown}
            aria-describedby={
              cooldown.isCoolingDown ? "join-retry-wait" : undefined
            }
            className="mt-6 w-full rounded-2xl bg-brand px-5 py-4 font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending
              ? "참여하고 있어요..."
              : cooldown.isCoolingDown
                ? `${cooldown.remainingSeconds}초 후 다시 시도`
                : "모임 참여하기"}
          </button>
        </fieldset>
      </form>
    </section>
  );
}
