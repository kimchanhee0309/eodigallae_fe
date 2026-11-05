"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";

import {
  getRecentRoomSnapshot,
  parseRecentRooms,
  removeRecentRoom,
  subscribeRecentRooms,
} from "../recent-rooms";

function getServerSnapshot(): null {
  return null;
}

export default function RecentRooms() {
  const snapshot = useSyncExternalStore(
    subscribeRecentRooms,
    getRecentRoomSnapshot,
    getServerSnapshot,
  );

  const [message, setMessage] = useState("");

  const rooms = parseRecentRooms(snapshot);

  if (rooms.length === 0) {
    return null;
  }

  function handleRemove(roomId: string) {
    const removed = removeRecentRoom(roomId);

    setMessage(
      removed
        ? "목록에서 지웠어요. 모임 참여 상태는 유지돼요."
        : "목록을 수정하지 못했어요. 브라우저 저장소 설정을 확인해주세요.",
    );
  }

  return (
    <section
      aria-labelledby="recent-rooms-title"
      className="border-t border-border py-10 sm:py-14"
    >
      <p className="text-sm font-bold text-brand">다시 만나는 우리 모임</p>

      <h2
        id="recent-rooms-title"
        className="mt-3 text-2xl font-extrabold tracking-tight"
      >
        최근 참여한 모임
      </h2>

      <p className="mt-3 text-sm leading-7 text-muted">
        이 브라우저에서 만들거나 참여한 모임이에요. 참여 정보가 만료되면 새 초대
        링크가 필요할 수 있어요.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {rooms.map((room) => (
          <li
            key={room.id}
            className="min-w-0 rounded-2xl border border-border bg-surface p-5"
          >
            <Link
              href={`/rooms/${room.id}`}
              prefetch={false}
              className="block rounded-xl font-bold hover:text-brand"
            >
              <span className="block break-words text-lg">{room.name}</span>

              <span className="mt-3 block text-sm text-brand">
                모임 이어보기 →
              </span>
            </Link>

            <button
              type="button"
              onClick={() => handleRemove(room.id)}
              aria-label={`${room.name} · 최근 모임 목록에서 지우기`}
              className="mt-4 min-h-11 rounded-xl px-3 py-2 text-xs text-muted hover:bg-background hover:text-foreground"
            >
              목록에서 지우기
            </button>
          </li>
        ))}
      </ul>

      <p role="status" className="mt-3 text-sm leading-6 text-muted">
        {message}
      </p>
    </section>
  );
}
