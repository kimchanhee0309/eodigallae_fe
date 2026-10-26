"use client";

import Link from "next/link";

import { ApiError } from "@/lib/api-client";
import { useRoomDetail } from "../hooks";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import JoinRoomForm from "./JoinRoomForm";
import InvitePanel from "./InvitePanel";

import CandidateSection from "@/features/candidates/components/CandidateSection";
import FinalizedPlaceCard from "@/features/finalization/components/FinalizedPlaceCard";

type RoomDetailProps = {
  roomId: string;
};

export default function RoomDetail({ roomId }: RoomDetailProps) {
  const query = useRoomDetail(roomId);

  const router = useRouter();
  const searchParmas = useSearchParams();

  const [hasJoined, setHasJoined] = useState(false);

  const inviteValues = searchParmas.getAll("invite");
  const hasInvite = searchParmas.has("invite");

  const inviteToken =
    inviteValues.length === 1 && /^[A-Za-z0-9_-]{43}$/.test(inviteValues[0])
      ? inviteValues[0]
      : null;

  useEffect(() => {
    if (!query.isSuccess || !hasInvite) {
      return;
    }

    const nextParams = new URLSearchParams(searchParmas.toString());

    nextParams.delete("invite");

    const queryString = nextParams.toString();
    router.replace(`/rooms/${roomId}${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [query.isSuccess, hasInvite, searchParmas, roomId, router]);

  if (query.isPending) {
    return (
      <p
        role="status"
        className="rounded-3xl border border-border bg-surface p-8 text-muted"
      >
        모임 정보를 불러오고 있어요...
      </p>
    );
  }

  if (query.isError) {
    const error = query.error;

    const status = error instanceof ApiError ? error.status : 0;

    if (status === 401 && inviteToken && !hasJoined) {
      return (
        <JoinRoomForm
          roomId={roomId}
          inviteToken={inviteToken}
          onJoined={() => {
            setHasJoined(true);

            router.replace(`/rooms/${roomId}`, {
              scroll: false,
            });

            void query.refetch();
          }}
        />
      );
    }

    if (status === 401 && hasInvite && !inviteToken) {
      return (
        <section
          role="alert"
          className="rounded-3xl border border-border bg-surface p-8"
        >
          <h1 className="text-2xl font-extrabold">초대 링크를 확인해주세요</h1>

          <p className="mt-4 leading-7 text-muted">
            링크가 올바르지 않아요. 방장에게 초대 링크를 다시 받아주세요.
          </p>
        </section>
      );
    }

    const accessDenied = status === 401 || status === 403;
    const notFound = status === 404;

    const title = accessDenied
      ? "모임 참여 정보를 확인할 수 없어요"
      : notFound
        ? "모임을 찾을 수 없어요"
        : "모임을 불러오지 못했어요";

    const description = accessDenied
      ? "모임에 참여한 브라우저에서 접속했는지 확인해주세요. 참여 정보가 만료되었을 수도 있어요."
      : notFound
        ? "모임이 삭제되었거나 더 이상 이용할 수 없어요."
        : "연결 상태를 확인하고 다시 시도해주세요.";

    return (
      <section
        role="alert"
        className="rounded-3xl border border-border bg-surface p-8"
      >
        <h1 className="text-2xl font-extrabold">{title}</h1>

        <p className="mt-4 leading-7 text-muted">{description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {!accessDenied && !notFound && (
            <button
              type="button"
              disabled={query.isFetching}
              onClick={() => {
                void query.refetch();
              }}
              className="rounded-2xl bg-brand px-5 py-3 font-bold text-white disabled:opacity-60"
            >
              다시 시도
            </button>
          )}

          <Link
            href="/"
            className="rounded-2xl border border-border px-5 py-3 font-semibold"
          >
            홈으로
          </Link>
        </div>
      </section>
    );
  }

  const { room, me } = query.data;

  const createdAt = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(room.createdAt));

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand">
            {room.status === "OPEN" ? "의견 모으는 중" : "장소 확정"}
          </span>

          <button
            type="button"
            disabled={query.isFetching}
            onClick={() => {
              void query.refetch();
            }}
            className="text-sm font-semibold text-muted hover:text-brand disabled:opacity-60"
          >
            {query.isFetching ? "확인 중..." : "새로 확인"}
          </button>
        </div>

        <h1 className="mt-6 break-words text-3xl font-extrabold tracking-tight">
          {room.name}
        </h1>

        <p className="mt-4 whitespace-pre-wrap break-words leading-8 text-muted">
          {room.description || "등록된 모임 설명이 없어요."}
        </p>

        <dl className="mt-8 grid gap-5 border-t border-border pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">함께하는 사람</dt>

            <dd className="mt-2 font-bold">{room.participantCount}명</dd>
          </div>

          <div>
            <dt className="text-sm text-muted">모임 생성일 · 한국 시간</dt>

            <dd className="mt-2">
              <time dateTime={room.createdAt}>{createdAt}</time>
            </dd>
          </div>
        </dl>
      </section>

      {room.status === "FINALIZED" &&
        (room.finalizedCandidate && room.finalizedAt ? (
          <FinalizedPlaceCard
            candidate={room.finalizedCandidate}
            finalizedAt={room.finalizedAt}
          />
        ) : (
          <p
            role="alert"
            className="rounded-3xl border border-border bg-surface p-6 text-muted"
          >
            마감된 모임이지만 확정 장소 정보를 확인할 수 없어요. 방장에게
            문의해주세요
          </p>
        ))}

      <section className="rounded-3xl border border-border bg-brand-soft p-6">
        <h2 className="font-bold">내 참여 정보</h2>

        <p className="mt-3 break-words">
          {me.nickname}
          <span className="ml-3 text-sm text-brand">
            {me.role === "HOST" ? "방장" : "참여자"}
          </span>
        </p>
      </section>

      {me.role === "HOST" && room.status === "OPEN" && (
        <InvitePanel roomId={room.id} />
      )}

      <CandidateSection
        key={room.id}
        roomId={room.id}
        roomStatus={room.status}
        isHost={me.role === "HOST"}
      />
    </div>
  );
}
