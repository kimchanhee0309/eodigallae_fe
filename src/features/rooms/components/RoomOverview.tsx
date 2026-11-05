"use client";

import type { RoomDetailData } from "../schemas";

type RoomOverviewProps = {
  room: RoomDetailData["room"];
  me: RoomDetailData["me"];
  refreshing: boolean;
  onRefresh: () => void;
};

export default function RoomOverview({
  room,
  me,
  refreshing,
  onRefresh,
}: RoomOverviewProps) {
  const isClosed = room.status === "FINALIZED";
  const isHost = me.role === "HOST";

  const createdAt = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(room.createdAt));

  const guidance = isClosed
    ? "함께 갈 장소가 정해졌어요. 아래에서 확정 장소와 투표 결과를 확인해주세요."
    : isHost
      ? "친구들을 초대하고 장소 후보를 모아보세요. 투표 결과를 참고해 최종 장소를 확인할 수 있어요."
      : "가고 싶은 장소를 추천하고 마음에 드는 후보에 투표해주세요. 최종 장소는 방장이 확정해요.";

  return (
    <section
      aria-labelledby="room-title"
      className="overflow-hidden rounded-3xl border border-border bg-surface"
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              isClosed
                ? "bg-green-50 text-green-800"
                : "bg-brand-soft text-brand"
            }`}
          >
            {isClosed ? "장소 확정 완료" : "장소를 고르는 중"}
          </span>

          <button
            type="button"
            disabled={refreshing}
            onClick={onRefresh}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-muted hover:bg-background hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? "확인 중..." : "모임 정보 새로 확인"}
          </button>
        </div>

        <h1
          id="room-title"
          className="mt-6 break-words text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
        >
          {room.name}
        </h1>

        {room.description && (
          <p className="mt-4 whitespace-pre-wrap break-words leading-8 text-muted">
            {room.description}
          </p>
        )}

        <dl className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-background p-4">
            <dt className="text-sm text-muted">함께하는 사람</dt>

            <dd className="mt-2 text-xl font-extrabold">
              {room.participantCount}
              <span className="ml-1 text-sm font-medium text-muted">명</span>
            </dd>
          </div>

          <div className="min-w-0 rounded-2xl bg-background p-4">
            <dt className="text-sm text-muted">이 모임에서 나는</dt>

            <dd className="mt-2 flex flex-wrap items-center gap-2">
              <span className="break-words font-bold">{me.nickname}</span>

              <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
                {isHost ? "방장" : "참여자"}
              </span>
            </dd>
          </div>
        </dl>

        <p className="mt-5 text-xs leading-6 text-muted">
          모임 생성 ·<time dateTime={room.createdAt}>{createdAt}</time> · 한국
          시간
        </p>
      </div>

      <div className="border-t border-border bg-background p-6 sm:px-8">
        <h2 className="font-bold">
          {isClosed ? "이제 만날 준비를 해볼까요?" : "이제 함께 골라볼까요?"}
        </h2>

        <p className="mt-2 text-sm leading-7 text-muted">{guidance}</p>

        <nav
          aria-label="모임 화면 바로가기"
          className="mt-5 flex flex-wrap gap-3"
        >
          <a
            href="#room-candidates"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-hover"
          >
            {isClosed ? "후보·투표 결과 보기" : "장소 후보·투표 보기"}
          </a>

          {isHost && !isClosed && (
            <a
              href="#room-invite"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-4 py-3 text-sm font-bold hover:bg-brand-soft"
            >
              친구 초대 안내
            </a>
          )}
        </nav>
      </div>
    </section>
  );
}
