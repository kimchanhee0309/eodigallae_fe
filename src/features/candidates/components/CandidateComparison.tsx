"use client";

import { useState } from "react";

import type { Candidate } from "../schemas";
import CandidateMenuList from "./CandidateMenuList";

type CandidateComparisonProps = {
  candidates: Candidate[];
  voteCounts: ReadonlyMap<string, number>;
};

export default function CandidateComparison({
  candidates,
  voteCounts,
}: CandidateComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedCandidates = selectedIds.flatMap((id) => {
    const candidate = candidates.find((item) => item.id === id);

    return candidate ? [candidate] : [];
  });

  const selectedSet = new Set(
    selectedCandidates.map((candidate) => candidate.id),
  );

  function toggleCandidate(candidateId: string) {
    setSelectedIds((previous) => {
      const current = previous.filter((id) =>
        candidates.some((candidate) => candidate.id === id),
      );

      if (current.includes(candidateId)) {
        return current.filter((id) => id !== candidateId);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, candidateId];
    });
  }

  if (candidates.length < 2) {
    return null;
  }

  return (
    <section
      aria-labelledby="candidate-comparison-title"
      className="mt-6 rounded-2xl border border-border bg-background p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="candidate-comparison-title" className="text-lg font-extrabold">
          메뉴·가격 비교하기
        </h3>

        <button
          type="button"
          disabled={selectedCandidates.length === 0}
          onClick={() => setSelectedIds([])}
          className="min-h-11 rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
        >
          선택 초기화
        </button>
      </div>

      <p className="mt-2 text-sm leading-7 text-muted">
        비교할 장소를 2~3곳 골라주세요. 비교 대상을 선택해도 투표는 바뀌지
        않아요.
      </p>

      <fieldset className="mt-4 min-w-0">
        <legend className="text-sm font-bold">
          비교할 장소 · {selectedCandidates.length}/3
        </legend>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {candidates.map((candidate) => {
            const checked = selectedSet.has(candidate.id);
            const disabled = !checked && selectedCandidates.length >= 3;

            return (
              <label
                key={candidate.id}
                className={`flex min-w-0 items-start gap-3 rounded-xl border p-3 ${
                  checked
                    ? "border-brand bg-brand-soft"
                    : "border-border bg-surface"
                } ${
                  disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleCandidate(candidate.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-brand"
                />

                <span className="min-w-0 break-words text-sm font-semibold leading-6">
                  {candidate.name}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p role="status" className="mt-3 text-sm leading-6 text-muted">
        {selectedCandidates.length < 2
          ? "장소를 2곳 이상 선택하면 비교표가 나타나요."
          : `${selectedCandidates.length}곳을 비교하고 있어요. 최대 3곳까지 선택할 수 있어요.`}
      </p>

      {selectedCandidates.length >= 2 && (
        <>
          <p
            id="candidate-comparison-help"
            className="mt-5 text-sm leading-7 text-muted"
          >
            메뉴마다 가격 기준이 달라요. 금액과 함께 1인분·1잔·세트 여부를
            확인해주세요. 작은 화면에서는 표를 좌우로 움직일 수 있어요.
          </p>

          <div
            role="region"
            aria-labelledby="candidate-comparison-title"
            aria-describedby="candidate-comparison-help"
            tabIndex={0}
            className="mt-3 overflow-x-auto rounded-2xl border border-border bg-surface"
          >
            <table className="w-full min-w-[40rem] table-fixed border-collapse text-left text-sm">
              <caption className="sr-only">
                선택한 장소의 주소, 대표 메뉴, 가격과 투표수 비교
              </caption>

              <thead>
                <tr className="bg-brand-soft">
                  <th scope="col" className="w-24 p-4">
                    비교 항목
                  </th>

                  {selectedCandidates.map((candidate) => (
                    <th
                      key={candidate.id}
                      scope="col"
                      className="break-words p-4 align-top text-base font-extrabold"
                    >
                      {candidate.name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr className="border-t border-border">
                  <th scope="row" className="p-4 align-top">
                    주소
                  </th>

                  {selectedCandidates.map((candidate) => (
                    <td
                      key={candidate.id}
                      className="break-words p-4 align-top leading-7 text-muted"
                    >
                      {candidate.address}
                    </td>
                  ))}
                </tr>

                <tr className="border-t border-border">
                  <th scope="row" className="p-4 align-top">
                    메뉴·가격
                  </th>

                  {selectedCandidates.map((candidate) => (
                    <td key={candidate.id} className="p-4 align-top">
                      <CandidateMenuList menus={candidate.menus} />
                    </td>
                  ))}
                </tr>

                <tr className="border-t border-border">
                  <th scope="row" className="p-4 align-top">
                    받은 투표
                  </th>

                  {selectedCandidates.map((candidate) => {
                    const count = voteCounts.get(candidate.id);

                    return (
                      <td
                        key={candidate.id}
                        className="p-4 align-top font-bold text-brand"
                      >
                        {count === undefined ? "집계 확인 필요" : `${count}표`}
                      </td>
                    );
                  })}
                </tr>

                <tr className="border-t border-border">
                  <th scope="row" className="p-4 align-top">
                    위치 확인
                  </th>

                  {selectedCandidates.map((candidate) => (
                    <td key={candidate.id} className="p-4 align-top">
                      {candidate.mapUrl ? (
                        <a
                          href={candidate.mapUrl}
                          target="_black"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-11 items-center font-bold text-brand underline underline-offset-4"
                        >
                          지도 보기 ↗
                          <span className="sr-only"> · 새 탭에서 열림</span>
                        </a>
                      ) : (
                        <span className="text-muted">지도 링크 없음</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
