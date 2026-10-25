"use client";

import { ApiError } from "@/lib/api-client";

import { useCandidates } from "../hooks";
import CreateCandidateForm from "./CreateCandidateForm";

type CandidateSectionProps = {
  roomId: string;
  roomStatus: "OPEN" | "FINALIZED";
};

export default function CandidateSection({
  roomId,
  roomStatus,
}: CandidateSectionProps) {
  const query = useCandidates(roomId);

  if (query.isPending) {
    return (
      <p
        role="status"
        className="roundedd-3xl border border-border bg-surface p-6"
      >
        추천 장소를 불러오고 있어요...
      </p>
    );
  }

  if (query.isError) {
    return (
      <section className="rounded-3xl border border-bordeer bg-surface p-6">
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
          disabled={query.isFetching}
          onClick={() => {
            void query.refetch();
          }}
          className="mt-4 rounded-2xl border border-border px-4 py-3 font-bold disabled:opacity-60"
        >
          다시 확인
        </button>
      </section>
    );
  }

  const candidates = query.data;
  const isFull = candidates.length >= 50;

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
          disabled={query.isFetching}
          onClick={() => {
            void query.refetch();
          }}
          className="text-sm font-semibold text-muted hover:text-brand disabled:opacity-60"
        >
          {query.isFetching ? "확인 중..." : "목록 새로 확인"}
        </button>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted">
        가고 싶은 장소를 추천하고 친구들의 후보도 살펴보세요.
      </p>

      {candidates.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-background p-6 text-muted">
          아직 추천된 장소가 없어요. 첫 번째 장소를 추천해볼까요?
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {candidates.map((candidate) => (
            <li
              key={candidate.id}
              className="min-w-0 rounded-2xl border border-border p-5"
            >
              <h3 className="break-words text-lg font-bold">
                {candidate.name}
              </h3>

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
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 border-t border-border pt-6">
        {roomStatus === "FINALIZED" ? (
          <p className="text-sm text-muted">
            장소가 확정되어 새로운 후보를 등록할 수 없어요.
          </p>
        ) : isFull ? (
          <p className="text-sm text-muted">
            후보가 50개 모였어요. 등록된 장소를 함께 살펴보세요.
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
