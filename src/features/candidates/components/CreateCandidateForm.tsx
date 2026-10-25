"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";

import { ApiError } from "@/lib/api-client";

import { useCreateCandidate } from "../hooks";
import { createCandidateInputSchema } from "../schemas";

const emptyForm = {
  name: "",
  address: "",
  mapUrl: "",
  memo: "",
};

type FormValues = typeof emptyForm;

type CreateCandidateFormProps = {
  roomId: string;
};

const inputFields = [
  {
    name: "name",
    label: "장소명",
    placeholder: "예: 주말에 가고 싶은 카페",
    maxLength: 100,
    required: true,
  },
  {
    name: "address",
    label: "주소",
    placeholder: "예: 서울특별시 마포구 …",
    maxLength: 200,
    required: true,
  },
  {
    name: "mapUrl",
    label: "지도 링크 · 선택",
    placeholder: "https://map.naver.com/…",
    maxLength: 2000,
    required: false,
  },
] as const;

export default function CreateCandidateForm({
  roomId,
}: CreateCandidateFormProps) {
  const [values, setValues] = useState<FormValues>(emptyForm);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const submittingRef = useRef(false);
  const mutation = useCreateCandidate(roomId);

  function updateField(field: keyof FormValues, value: string) {
    setValues((previous) => ({
      ...previous,
      [field]: value,
    }));

    setValidationError(null);
    setSuccessMessage("");

    if (mutation.isError) {
      mutation.reset();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) {
      return;
    }

    setSuccessMessage("");

    const result = createCandidateInputSchema.safeParse(values);

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

      setValues(emptyForm);
      setSuccessMessage("장소 후보를 등록했어요!");
    } catch {
    } finally {
      submittingRef.current = false;
    }
  }

  const requestError =
    mutation.error instanceof ApiError
      ? (mutation.error.details[0]?.message ?? mutation.error.message)
      : "장소 후보를 등록하지 못했어요.";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-busy={mutation.isPending}
      className="mt-6"
    >
      <fieldset disabled={mutation.isPending} className="space-y-5">
        <legend className="sr-only">장소 후보 등록</legend>

        {inputFields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={`candidate-${field.name}`}
              className="text-sm font-bold"
            >
              {field.label}
            </label>

            <input
              id={`candidate-${field.name}`}
              name={field.name}
              type={field.name === "mapUrl" ? "url" : "text"}
              required={field.required}
              maxLength={field.maxLength}
              value={values[field.name]}
              onChange={(event) => {
                updateField(field.name, event.target.value);
              }}
              placeholder={field.placeholder}
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3"
            />
          </div>
        ))}

        <div>
          <label htmlFor="candidate-memo" className="text-sm font-bold">
            추천 이유 · 선택
          </label>

          <textarea
            id="candidate-memo"
            name="memo"
            rows={3}
            maxLength={300}
            value={values.memo}
            onChange={(event) => {
              updateField("memo", event.target.value);
            }}
            placeholder="친구들에게 이 장소를 추천하는 이유를 알려주세요."
            className="mt-2 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3"
          />
        </div>

        {validationError && (
          <p role="alert" className="text-sm text-red-700">
            {validationError}
          </p>
        )}

        {mutation.isError && (
          <p
            role="alert"
            className="rounded-2xl bg-red-50 p-4 text-sm text-red-700"
          >
            {requestError}
            {mutation.error instanceof ApiError &&
              mutation.error.code === "NETWORK_ERROR" && (
                <span className="mt-2 block">
                  저장됐을 수도 있으니 목록을 새로 확인한 뒤 다시 시도해주세요.
                </span>
              )}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-2xl bg-brand px-5 py-4 font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? "등록하고 있어요..." : "이 장소 추천하기"}
        </button>
      </fieldset>

      <p role="status" className="mt-3 text-sm font-semibold text-brand">
        {successMessage}
      </p>
    </form>
  );
}
