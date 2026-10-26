"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";

import { ApiError } from "@/lib/api-client";

import { useFinalizeRoom } from "../hooks";

type FinalizePlacePanelProps = {
  roomId: string;
  candidates: {
    id: string;
    name: string;
    address: string;
  }[];
};

export default function FinalizePlacePanel({
  roomId,
  candidates,
}: FinalizePlacePanelProps) {
  const [candidateId, setCandidateId] = useState("");
  const [validationError, setValidationError] = useState("");

  const submittingRef = useRef(false);
  const mutation = useFinalizeRoom(roomId);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current || mutation.isPending) {
      return;
    }

    const selected = candidates.find(
      (candidate) => candidate.id === candidateId,
    );

    if (!selected) {
      setValidationError("확정할 장소를 선택해주세요.");
      return;
    }

    setValidationError("");

    const confirmed = window.confirm(
      `"${selected.name}"으로 최종 확정할까요?\n\n` +
        "확정 후에는 장소 변경, 후보 등록, 투표 변경과 " +
        "새로운 참여가 마감돼요.",
    );

    if (!confirmed) {
      return;
    }

    submittingRef.current = true;
    mutation.reset();

    try {
      await mutation.mutateAsync(selected.id);
    } catch {
      // 요청 오류는 아래 mutation 상태로 표시합니다.
    } finally {
      submittingRef.current = false;
    }
  }

  if (candidates.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-brand bg-brand-soft p-5">
      <h3 className="text-lg font-extrabold">우리 여기서 만날까요?</h3>

      <p className="mt-3 text-sm leading-7 text-muted">
        방장이 최종 장소를 정할 수 있어요. 친구들의 의견과 득표수를 살펴보고
        선택해주세요.
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-busy={mutation.isPending}
        className="mt-5"
      >
        <fieldset disabled={mutation.isPending}>
          <legend className="sr-only">최종 장소 확정</legend>

          <label htmlFor="finalize-candidate" className="text-sm font-bold">
            최종 장소
          </label>

          <select
            id="finalize-candidate"
            value={candidateId}
            required
            aria-invalid={Boolean(validationError)}
            aria-describedby={
              validationError ? "finalize-validation-error" : undefined
            }
            onChange={(event) => {
              setCandidateId(event.target.value);
              setValidationError("");

              if (mutation.isError) {
                mutation.reset();
              }
            }}
            className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3"
          >
            <option value="">장소를 선택해주세요</option>

            {candidates.map((candidate) => (
              <option key={candidate.id} value={candidate.id}>
                {candidate.name} · {candidate.address}
              </option>
            ))}
          </select>

          {validationError && (
            <p
              id="finalize-validation-error"
              role="alert"
              className="mt-3 text-sm text-red-700"
            >
              {validationError}
            </p>
          )}

          <p className="mt-3 text-sm leading-6 text-muted">
            확정 후에는 최종 장소를 변경할 수 없어요.
          </p>

          {mutation.isError && (
            <p
              role="alert"
              className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700"
            >
              {mutation.error instanceof ApiError
                ? mutation.error.message
                : "장소를 확정하지 못했어요."}

              {mutation.error instanceof ApiError &&
                mutation.error.code === "NETWORK_ERROR" && (
                  <span className="mt-2 block">
                    이미 확정됐을 수도 있으니 모임 정보를 새로 확인해주세요.
                  </span>
                )}
            </p>
          )}

          <button
            type="submit"
            className="mt-5 w-full roundeed-2xl bg-brand px-5 py-4 font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "확정하고 있어요..." : "이 장소로 최종 확정"}
          </button>
        </fieldset>
      </form>
    </section>
  );
}
