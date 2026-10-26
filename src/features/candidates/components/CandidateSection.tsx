"use client";

import { useRef, useState } from "react";

import { ApiError } from "@/lib/api-client";
import { useSetVote, useVotes } from "@/features/votes/hooks";

import { useCandidates } from "../hooks";
import CreateCandidateForm from "./CreateCandidateForm";

import { useQueryClient } from "@tanstack/react-query";
import FinalizePlacePanel from "@/features/finalization/components/FinalizePlacePanel";

type CandidateSectionProps = {
  roomId: string;
  roomStatus: "OPEN" | "FINALIZED";
  isHost: boolean;
};

export default function CandidateSection({
  roomId,
  roomStatus,
  isHost,
}: CandidateSectionProps) {
  const queryClient = useQueryClient();
  const query = useCandidates(roomId);
  const votes = useVotes(roomId);
  const mutation = useSetVote(roomId);

  const submittingRef = useRef(false);
  const [message, setMessage] = useState("");

  async function handleVote(candidateId: string | null) {
    if (
      submittingRef.current ||
      mutation.isPending ||
      votes.isFetching ||
      !votes.isSuccess ||
      roomStatus !== "OPEN"
    ) {
      return;
    }

    submittingRef.current = true;
    setMessage("");
    mutation.reset();

    try {
      await mutation.mutateAsync({ candidateId });

      setMessage(
        candidateId === null ? "투표를 취소했어요." : "투표를 반영했어요!",
      );
    } catch {
      // 요청 오류는 아래 mutation 상태로 표시합니다.
    } finally {
      submittingRef.current = false;
    }
  }

  function refresh() {
    setMessage("");

    void Promise.all([
      query.refetch(),
      votes.refetch(),
      queryClient.invalidateQueries({
        queryKey: ["rooms", "detail", roomId],
        exact: true,
      }),
    ]);
  }

  if (query.isPending) {
    return (
      <p
        role="status"
        className="rounded-3xl border border-border bg-surface p-6"
      >
        추천 장소를 불러오고 있어요...
      </p>
    );
  }

  if (query.isError) {
    return (
      <section className="rounded-3xl border border-border bg-surface p-6">
        <h2 className="text-xl font-extrabold">
          추천 장소를 불러오지 못했어요
        </h2>

        <p role="alert" className="mt-3 text-sm text-red-700">
          {query.error instanceof ApiError
            ? query.error.message
            : "연결 상태를 확인하고 다시 시도해주세요."}
        </p>

        <button
          type="button"
          disabled={query.isFetching || votes.isFetching}
          onClick={refresh}
          className="mt-4 rounded-2xl border border-border px-4 py-3 font-bold disabled:opacity-60"
        >
          다시 확인
        </button>
      </section>
    );
  }

  const candidates = query.data;
  const isFull = candidates.length >= 50;
  const isClosed = roomStatus === "FINALIZED";

  const voteData = votes.isSuccess ? votes.data : undefined;
  const myCandidateId = voteData?.myCandidateId ?? null;

  const counts = new Map(
    voteData?.candidates.map((candidate) => [
      candidate.candidateId,
      candidate.voteCount,
    ]),
  );

  const refreshing = query.isFetching || votes.isFetching;

  const voteDisabled =
    isClosed || !voteData || votes.isFetching || mutation.isPending;

  return (
    <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold">
          함께 고르는 장소
          <span className="ml-2 text-base text-brand">
            {candidates.length}/50
          </span>
        </h2>

        <button
          type="button"
          disabled={refreshing || mutation.isPending}
          onClick={refresh}
          className="text-sm font-semibold text-muted hover:text-brand disabled:opacity-60"
        >
          {refreshing ? "확인 중..." : "목록·투표 새로 확인"}
        </button>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">
        {isClosed
          ? "최종 장소가 정해졌어요. 친구들이 추천한 장소와 투표 결과도 확인해보세요."
          : "가장 가고 싶은 장소에 한 표를 주세요. 다른 장소로 변경하거나 선택한 장소의 투표를 취소할 수 있어요."}
      </p>

      {voteData && (
        <p className="mt-3 text-sm font-semibold text-brand">
          현재 총 {voteData.totalVotes}표
        </p>
      )}

      {votes.isPending && (
        <p role="status" className="mt-3 text-sm text-muted">
          투표 결과를 확인하고 있어요...
        </p>
      )}

      {votes.isError && (
        <p
          role="alert"
          className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700"
        >
          {votes.error instanceof ApiError
            ? votes.error.message
            : "투표 결과를 불러오지 못했어요."}
          <span className="mt-1 block">
            위의 새로 확인 버튼으로 다시 조회해주세요.
          </span>
        </p>
      )}

      {mutation.isError && (
        <p
          role="alert"
          className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700"
        >
          {mutation.error instanceof ApiError
            ? mutation.error.message
            : "투표를 처리하지 못했어요."}
          {mutation.error instanceof ApiError &&
            mutation.error.code === "NETWORK_ERROR" && (
              <span className="mt-1 block">
                투표가 반영됐을 수도 있으니 현재 결과를 확인해주세요.
              </span>
            )}
        </p>
      )}

      <p role="status" className="mt-3 text-sm font-semibold text-brand">
        {mutation.isPending ? "투표를 처리하고 있어요..." : message}
      </p>

      {candidates.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-background p-6 text-muted">
          아직 추천된 장소가 없어요. 첫 번째 장소를 추천해볼까요?
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {candidates.map((candidate) => {
            const selected = myCandidateId === candidate.id;
            const count = counts.get(candidate.id);

            const buttonLabel = isClosed
              ? "투표 마감"
              : selected
                ? "투표 취소"
                : myCandidateId
                  ? "이 장소로 변경"
                  : "이 장소에 투표";

            return (
              <li
                key={candidate.id}
                className={`min-w-0 rounded-2xl border p-5 ${
                  selected ? "border-brand bg-brand-soft" : "border-border"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="break-words text-lg font-bold">
                    {candidate.name}
                  </h3>

                  {selected && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand">
                      내 선택
                    </span>
                  )}
                </div>

                <p className="mt-2 break-words text-sm leading-6 text-muted">
                  {candidate.address}
                </p>

                {candidate.memo && (
                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7">
                    {candidate.memo}
                  </p>
                )}

                <p className="mt-4 break-words text-sm text-muted">
                  추천한 사람 · {candidate.createdBy.nickname}
                </p>

                {candidate.mapUrl && (
                  <a
                    href={candidate.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block font-bold text-brand underline underline-offset-4"
                  >
                    지도 보기
                    <span className="sr-only"> · 새 탭에서 열림</span>
                  </a>
                )}

                <div className="mt-5 border-t border-border pt-4">
                  <p className="font-bold text-brand">
                    {count === undefined ? "집계 확인 필요" : `${count}표`}
                  </p>

                  <button
                    type="button"
                    aria-pressed={selected}
                    aria-label={`${candidate.name} · ${buttonLabel}`}
                    disabled={voteDisabled || count === undefined}
                    onClick={() => {
                      void handleVote(selected ? null : candidate.id);
                    }}
                    className="mt-3 w-full rounded-2xl bg-brand px-4 py-3 font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {buttonLabel}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {isHost && !isClosed && (
        <FinalizePlacePanel roomId={roomId} candidates={candidates} />
      )}
      <div className="mt-8 border-t border-border pt-6">
        {isClosed ? (
          <p className="text-sm text-muted">
            장소가 확정되어 후보 등록과 투표 변경이 마감됐어요.
          </p>
        ) : isFull ? (
          <p className="text-sm text-muted">
            후보가 50개 모였어요. 마음에 드는 장소에 투표해주세요.
          </p>
        ) : (
          <>
            <h3 className="text-lg font-bold">여기는 어때요?</h3>

            <CreateCandidateForm roomId={roomId} />
          </>
        )}
      </div>
    </section>
  );
}
