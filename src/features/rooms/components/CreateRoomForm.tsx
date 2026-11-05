"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import { useRetryCooldown } from "@/hooks/use-retry-cooldown";
import { ApiError } from "@/lib/api-client";

import { useCreateRoom } from "../hooks";
import { normalizeCreateRoomInput, validateCreateRoomInput } from "../schemas";
import type { CreateRoomErrors, CreateRoomInput } from "../types";

import InviteLinkActions from "./InviteLinkActions";

const initialValues: CreateRoomInput = {
  name: "",
  hostNickname: "",
  description: "",
};

const textFields = [
  {
    name: "name",
    label: "모임 이름",
    placeholder: "예: 주말에 우리 어디갈래?",
    maxLength: 40,
    autoComplete: "off",
  },
  {
    name: "hostNickname",
    label: "내 닉네임",
    placeholder: "예: 모임대장",
    maxLength: 12,
    autoComplete: "nickname",
  },
] as const;

const inputClassName =
  "mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base placeholder:text-muted";

export default function CreateRoomForm() {
  const [values, setValues] = useState<CreateRoomInput>(initialValues);
  const [errors, setErrors] = useState<CreateRoomErrors>({});

  const submittingRef = useRef(false);

  const mutation = useCreateRoom();
  const cooldown = useRetryCooldown();

  function updateField(field: keyof CreateRoomInput, value: string) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    // 오류 메시지를 지워도 별도로 관리하는 대기 시간은 유지됩니다.
    if (mutation.isError) {
      mutation.reset();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current || mutation.isSuccess || !cooldown.canSubmit()) {
      return;
    }

    const input = normalizeCreateRoomInput(values);
    const nextErrors = validateCreateRoomInput(input);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    submittingRef.current = true;

    try {
      await mutation.mutateAsync(input);
    } catch (error) {
      cooldown.startCooldown(error);

      if (error instanceof ApiError) {
        const serverErrors: CreateRoomErrors = {};

        for (const issue of error.details) {
          if (
            issue.field === "name" ||
            issue.field === "hostNickname" ||
            issue.field === "description"
          ) {
            serverErrors[issue.field] = issue.message;
          }
        }

        setErrors(serverErrors);
      }
    } finally {
      submittingRef.current = false;
    }
  }

  if (mutation.isSuccess) {
    const { room, participant, inviteUrl } = mutation.data;

    return (
      <section
        aria-labelledby="created-title"
        className="rounded-3xl border border-border bg-surface p-6 sm:p-8"
      >
        <p className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand">
          모임 준비 완료!
        </p>

        <h2
          id="created-title"
          className="mt-5 break-words text-2xl font-extrabold sm:text-3xl"
        >
          {room.name}
        </h2>

        <p className="mt-3 break-words leading-7 text-muted">
          {participant.nickname}님이 방장이에요.
          <br />
          이제 친구들을 초대하고 함께 갈 장소를 골라보세요.
        </p>

        {room.description && (
          <p className="mt-5 whitespace-pre-wrap break-words rounded-2xl bg-background p-4 leading-7">
            {room.description}
          </p>
        )}

        <div className="mt-7 border-t border-border pt-6">
          <InviteLinkActions
            inviteUrl={inviteUrl}
            title={`${room.name} | 어디갈래?`}
          />
        </div>

        <p className="mt-5 rounded-2xl bg-brand-soft p-4 text-sm leading-7">
          친구들은 초대 링크에서 닉네임을 입력하면 참여할 수 있어요. 방장인 나는
          아래 버튼으로 모임에 들어가면 돼요.
        </p>

        <Link
          href={`/rooms/${room.id}`}
          prefetch={false}
          className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-brand px-6 py-3 font-bold text-brand hover:bg-brand-soft"
        >
          모임으로 이동 →
        </Link>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={mutation.isPending}
      className="rounded-3xl border border-border bg-surface p-6 sm:p-8"
    >
      <fieldset disabled={mutation.isPending} className="min-w-0 space-y-6">
        {textFields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="text-sm font-bold">
              {field.label}

              <span className="ml-2 font-normal text-muted">필수</span>
            </label>

            <input
              id={field.name}
              name={field.name}
              type="text"
              required
              autoComplete={field.autoComplete}
              maxLength={field.maxLength}
              value={values[field.name]}
              onChange={(event) => updateField(field.name, event.target.value)}
              placeholder={field.placeholder}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
              className={inputClassName}
            />

            {errors[field.name] && (
              <p
                id={`${field.name}-error`}
                role="alert"
                className="mt-2 text-sm text-red-700"
              >
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}

        <div>
          <label htmlFor="description" className="text-sm font-bold">
            어떤 모임인가요?
            <span className="ml-2 font-normal text-muted">선택</span>
          </label>

          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={300}
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="날짜나 예산처럼 친구들이 알면 좋은 내용을 적어주세요."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
            className={`${inputClassName} resize-y`}
          />

          <p className="mt-2 text-right text-xs text-muted">
            {values.description.length}/300
          </p>

          {errors.description && (
            <p
              id="description-error"
              role="alert"
              className="mt-2 text-sm text-red-700"
            >
              {errors.description}
            </p>
          )}
        </div>

        {mutation.isError && (
          <p
            role="alert"
            className="rounded-2xl bg-red-50 p-4 text-sm text-red-700"
          >
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : "모임을 생성하지 못했습니다."}
          </p>
        )}

        {cooldown.isCoolingDown && (
          <p
            id="create-retry-wait"
            className="rounded-2xl bg-orange-50 p-4 text-sm text-orange-800"
          >
            {cooldown.remainingSeconds}초 후 다시 시도할 수 있어요.
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending || cooldown.isCoolingDown}
          aria-describedby={
            cooldown.isCoolingDown ? "create-retry-wait" : undefined
          }
          className="w-full rounded-2xl bg-brand px-5 py-4 font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending
            ? "모임을 만들고 있어요…"
            : cooldown.isCoolingDown
              ? `${cooldown.remainingSeconds}초 후 다시 시도`
              : "모임 만들기"}
        </button>
      </fieldset>
    </form>
  );
}
