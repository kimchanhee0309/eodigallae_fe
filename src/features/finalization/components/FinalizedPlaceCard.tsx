import type { FinalizedCandidate } from "../schemas";

type FinalizedPlaceCardProps = {
  candidate: FinalizedCandidate;
  finalizedAt: string;
};

export default function FinalizedPlaceCard({
  candidate,
  finalizedAt,
}: FinalizedPlaceCardProps) {
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(finalizedAt));

  return (
    <section
      aria-labelledby="finalized-place-title"
      className="rounded-3xl border border-brand bg-brand-soft p-6 sm:p-8"
    >
      <p className="text-sm font-bold text-brand">약속 장소가 정해졌어요</p>

      <h2
        id="finalized-place-title"
        className="mt-3 break-words text-2xl font-extrabold"
      >
        {candidate.name}
      </h2>

      <p className="mt-3 break-words leading-7">{candidate.address}</p>

      {candidate.memo && (
        <p className="mt-4 whitespace-pre-wrap break-words leading-7 text-muted">
          {candidate.memo}
        </p>
      )}

      {candidate.mapUrl && (
        <a
          href={candidate.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block rounded-2xl bg-brand px-5 py-3 font-bold text-white hover:bg-brand-hover"
        >
          지도에서 확인하기
          <span className="sr-only"> · 새 탭에서 열림</span>
        </a>
      )}

      <p className="mt-5 text-sm text-muted">
        확정 시각 · <time dateTime={finalizedAt}>{formattedDate}</time> · 한국
        시간
      </p>
    </section>
  );
}
