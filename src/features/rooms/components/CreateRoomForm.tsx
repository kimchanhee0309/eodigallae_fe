"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { normalizeCreateRoomInput, validateCreateRoomInput } from "../schemas";
import type { CreateRoomErrors, CreateRoomInput } from "../types";

const initialValues: CreateRoomInput = {
  name: "",
  hostNickname: "",
  description: "",
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-base placeholder:text-muted";

export default function CreateRoomForm() {
  const [values, setValues] = useState<CreateRoomInput>(initialValues);
  const [errors, setErrors] = useState<CreateRoomErrors>({});
  const [preview, setPreview] = useState<CreateRoomInput | null>(null);

  function updateField(field: keyof CreateRoomInput, value: string) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));

    setPreview(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = normalizeCreateRoomInput(values);
    const nextErrors = validateCreateRoomInput(input);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setPreview(null);
      return;
    }

    setPreview(input);
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-3xl border border-border bg-surface p-6 sm:p-8"
      >
        <div>
          <label htmlFor="room-name" className="text-sm font-bold">
            모임 이름
            <span className="ml-2 font-normal text-muted">필수</span>
          </label>

          <input
            id="room-name"
            name="name"
            type="text"
            required
            maxLength={40}
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="예: 주말에 우리 어디갈래?"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "room-name-error" : undefined}
            className={inputClassName}
          />

          {errors.name && (
            <p
              id="room-name-error"
              role="alert"
              className="mt-2 text-sm text-red-700"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="host-nickname" className="text-sm font-bold">
            내 닉네임
            <span className="ml-2 font-normal text-muted">필수</span>
          </label>

          <p className="mt-1 text-sm text-muted">
            친구들에게 표시될 방장 이름이에요.
          </p>

          <input
            id="host-nickname"
            name="hostNickname"
            type="text"
            autoComplete="nickname"
            required
            maxLength={12}
            value={values.hostNickname}
            onChange={(event) =>
              updateField("hostNickname", event.target.value)
            }
            placeholder="예: 모임대장"
            aria-invalid={Boolean(errors.hostNickname)}
            aria-describedby={
              errors.hostNickname ? "host-nickname-error" : undefined
            }
            className={inputClassName}
          />

          {errors.hostNickname && (
            <p
              id="host-nickname-error"
              role="alert"
              className="mt-2 text-sm text-red-700"
            >
              {errors.hostNickname}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="room-description" className="text-sm font-bold">
            어떤 모임인가요?
            <span className="ml-2 font-normal text-muted">선택</span>
          </label>

          <textarea
            id="room-description"
            name="description"
            rows={4}
            maxLength={300}
            value={values.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="날짜나 예산처럼 친구들이 알면 좋은 내용을 적어주세요."
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "room-description-error" : undefined
            }
            className={`${inputClassName} resize-y`}
          />

          <p className="mt-2 text-right text-xs text-muted">
            {values.description.length}/300
          </p>

          {errors.description && (
            <p
              id="room-description-error"
              role="alert"
              className="mt-2 text-sm text-red-700"
            >
              {errors.description}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-brand px-5 py-4 font-bold text-white transition-colors hover:bg-brand-hover"
        >
          입력 내용 확인
        </button>
      </form>

      {preview && (
        <section
          aria-labelledby="preview-title"
          aria-live="polite"
          className="rounded-3xl border border-border bg-brand-soft p-6"
        >
          <h2 id="preview-title" className="text-lg font-bold">
            이렇게 모여볼까요?
          </h2>

          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm text-muted">모임 이름</dt>
              <dd className="mt-1 break-words font-semibold">{preview.name}</dd>
            </div>

            <div>
              <dt className="text-sm text-muted">방장</dt>
              <dd className="mt-1 break-words">{preview.hostNickname}</dd>
            </div>

            <div>
              <dt className="text-sm text-muted">설명</dt>
              <dd className="mt-1 whitespace-pre-wrap break-words">
                {preview.description || "등록한 설명이 없어요."}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  );
}
