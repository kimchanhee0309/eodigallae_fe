"use client";

import { useRef, useState } from "react";

import { ApiError } from "@/lib/api-client";
import { useRotateRoomInvite } from "../hooks";

type InvitePanelProps = {
  roomId: string;
};

export default function InvitePanel({ roomId }: InvitePanelProps) {
  const [confirming, setConfirming] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const submittingRef = useRef(false);
  const mutation = useRotateRoomInvite(roomId);

  async function handleRotate() {
    if (submittingRef.current) {
      return;
    }

    submittingRef.current = true;
    setCopyMessage("");

    try {
      await mutation.mutateAsync();
      setConfirming(false);
    } catch {
    } finally {
      submittingRef.current = false;
    }
  }

  async function handleCopy() {
    if (!mutation.data) {
      return;
    }

    try {
      await navigator.clipboard.writeText(mutation.data.inviteUrl);

      setCopyMessage("초대 링크를 복사했어요.");
    } catch {
      setCopyMessage("복사하지 못했어요. 링크를 선택해 직접 복사해주세요.");
    }
  }

  return (
    <section className="rounded-3xl border border-border bg-surface p-6">
      <h2 className="text-lg font-bold">친구 초대하기</h2>

      <p className="mt-3 text-sm leading-7 text-muted">
        새 링크를 발급하면 이전 링크로는 새로 참여할 수 없어요. 이미 참여한
        친구들은 계속 이용할 수 있어요.
      </p>

      {mutation.isSuccess && (
        <div className="mt-5">
          <label htmlFor="room-invite-url" className="text-sm font-bold">
            새 초대 링크
          </label>

          <input
            id="room-invite-url"
            type="text"
            readOnly
            value={mutation.data.inviteUrl}
            onFocus={(event) => event.currentTarget.select()}
            className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3"
          />

          <button
            type="button"
            onClick={() => {
              void handleCopy();
            }}
            className="mt-3 rounded-2xl border border-border px-4 py-2 text-sm font-semibold"
          >
            링크 복사
          </button>
        </div>
      )}

      {copyMessage && (
        <p role="status" className="mt-3 text-sm text-muted">
          {copyMessage}
        </p>
      )}

      {mutation.isError && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {mutation.error instanceof ApiError
            ? mutation.error.message
            : "초대 링크를 발급하지 못했습니다."}
        </p>
      )}

      {confirming ? (
        <div className="mt-5 rounded-2xl bg-brand-soft p-4">
          <p className="text-sm leading-6">
            기존 초대 링크를 무효화하고 새로 발급할까요?
          </p>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => {
                void handleRotate();
              }}
              className="rounded-xl bg-brand px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {mutation.isPending ? "발급 중..." : "새 링크 발급"}
            </button>

            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => setConfirming(false)}
              className="rounded-xl border border-border bg-surface px-4 py-2 font-semibold disabled:opacity-60"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-5 rounded-2xl bg-brand px-5 py-3 font-bold text-white hover:bg-brand-hover"
        >
          새 초대 링크 발급
        </button>
      )}
    </section>
  );
}
