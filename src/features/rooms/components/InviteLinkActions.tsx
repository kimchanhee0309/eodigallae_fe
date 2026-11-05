"use client";

import { useId, useRef, useState } from "react";

type InviteLinkActionsProps = {
  inviteUrl: string;
  title: string;
};

export default function InviteLinkActions({
  inviteUrl,
  title,
}: InviteLinkActionsProps) {
  const inputId = useId();
  const messageId = useId();

  const inputRef = useRef<HTMLInputElement>(null);
  const workingRef = useRef(false);

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCopy() {
    if (workingRef.current) {
      return;
    }

    workingRef.current = true;
    setBusy(true);
    setMessage("");

    try {
      await navigator.clipboard.writeText(inviteUrl);

      setMessage("초대 링크를 복사했어요. 친구에게 붙여넣어 보내주세요.");
    } catch {
      inputRef.current?.focus();
      inputRef.current?.select();

      setMessage(
        "자동으로 복사하지 못했어요. 선택된 링크를 직접 복사해주세요.",
      );
    } finally {
      workingRef.current = false;
      setBusy(false);
    }
  }

  async function handleShare() {
    if (workingRef.current) {
      return;
    }

    if (typeof navigator.share !== "function") {
      await handleCopy();
      return;
    }

    workingRef.current = true;
    setBusy(true);
    setMessage("");

    try {
      await navigator.share({
        title,
        text: "우리 모임에서 함께 갈 장소를 골라주세요!",
        url: inviteUrl,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      setMessage("공유 창을 열지 못했어요. 링크 복사 버튼으로 초대해주세요.");
    } finally {
      workingRef.current = false;
      setBusy(false);
    }
  }

  return (
    <div>
      <label htmlFor={inputId} className="text-sm font-bold">
        친구에게 보낼 초대 링크
      </label>

      <input
        ref={inputRef}
        id={inputId}
        readOnly
        value={inviteUrl}
        aria-describedby={messageId}
        onFocus={(event) => event.currentTarget.select()}
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3"
      />

      <div aria-busy={busy} className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            void handleCopy();
          }}
          className="min-h-12 rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          링크 복사
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            void handleShare();
          }}
          className="min-h-12 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-bold hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          공유하기
        </button>
      </div>

      <p
        id={messageId}
        role="status"
        className="mt-3 text-sm leading-6 text-muted"
      >
        {message || "공유 기능을 지원하지 않는 브라우저에서는 링크를 복사해요"}
      </p>
    </div>
  );
}
