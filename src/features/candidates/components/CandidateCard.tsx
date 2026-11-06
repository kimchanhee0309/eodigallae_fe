"use client";

import type { Candidate } from "../schemas";

import CandidateMenuList from "./CandidateMenuList";

type CandidateCardProps = {
  candidate: Candidate;
  voteCount: number | undefined;
  selected: boolean;
  hasVoted: boolean;
  isClosed: boolean;
  disabled: boolean;
  onVote: () => void;
};

export default function CandidateCard({
  candidate,
  voteCount,
  selected,
  hasVoted,
  isClosed,
  disabled,
  onVote,
}: CandidateCardProps) {
  const buttonLabel = isClosed
    ? "투표 마감"
    : selected
      ? "내 투표 취소"
      : hasVoted
        ? "이 장소로 변경"
        : "이 장소에 투표";

  return (
    <li
      className={`flex min-w-0 flex-col rounded-2xl border p-5 ${
        selected ? "border-brand bg-brand-soft" : "border-border bg-surface"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-muted">장소 후보</span>

        {selected && (
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-brand">
            내가 투표한 장소
          </span>
        )}
      </div>

      <h3 className="mt-3 break-words text-xl font-extrabold leading-7">
        {candidate.name}
      </h3>

      <p className="mt-3 break-words text-sm leading-6 text-muted">
        {candidate.address}
      </p>

      {candidate.memo && (
        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7">
          {candidate.memo}
        </p>
      )}

      <CandidateMenuList menus={candidate.menus} />

      <p className="mt-4 break-words text-xs leading-6 text-muted">
        {candidate.createdBy.nickname}님의 추천
      </p>

      {candidate.mapUrl && (
        <a
          href={candidate.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 self-start items-center rounded-xl border border-border bg-surface px-4 py-2 text-sm font-bold text-brand hover:bg-background"
        >
          지도에서 위치 보기↗
          <span className="sr-only"> · 새 탭에서 열림</span>
        </a>
      )}

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm text-muted">받은 투표</p>

          <p className="font-extrabold text-brand">
            {voteCount === undefined ? "집계 확인 필요" : `${voteCount}표`}
          </p>
        </div>

        <button
          type="button"
          aria-pressed={selected}
          aria-label={`${candidate.name} · ${buttonLabel}`}
          disabled={disabled || voteCount === undefined}
          onClick={onVote}
          className={`mt-4 min-h-12 w-full rounded-xl px-4 py-3 font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            selected
              ? "border border-brand bg-surface text-brand hover:bg-background"
              : "bg-brand text-white hover:bg-brand-hover"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </li>
  );
}
