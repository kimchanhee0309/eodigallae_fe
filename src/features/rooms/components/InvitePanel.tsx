"use client";

import { useRef, useState } from "react";

import { ApiError } from "@/lib/api-client";
import { useRotateRoomInvite } from "../hooks";

import InviteLinkActions from "./InviteLinkActions";

type InvitePanelProps = {
  roomId: string;
};

export default function InvitePanel({ roomId }: InvitePanelProps) {
  const [confirming, setConfirming] = useState(false);

  const submittingRef = useRef(false);
  const mutation = useRotateRoomInvite(roomId);

  async function handleRotate() {
    if (submittingRef.current || mutation.isPending) {
      return;
    }

    submittingRef.current = true;

    try {
      await mutation.mutateAsync();
      setConfirming(false);
    } catch {
      // 오류 메시지는 mutation 상태로 표시합니다.
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <section
      aria-labelledby="invite-panel-title"
      className="rounded-3xl border border-border bg-surface p-6 sm:p-8"
    >
      <p className="text-sm font-bold text-brand">방장 메뉴</p>

      <h2 id="invite-panel-title" className="mt-2 text-xl font-extrabold">
        친구 초대하기
      </h2>

      <p className="mt-3 text-sm leading-7 text-muted">
        새 초대 링크가 필요하면 여기서 발급할 수 있어요. 새 링크를 발급하면 이전
        링크로는 새로 참여할 수 없지만, 이미 참여한 친구들은 계속 이용할 수
        있어요.
      </p>

      {mutation.isSuccess && (
        <div className="mt-6 border-t border-border pt-6">
          <p role="status" className="mb-4 text-sm font-bold text-brand">
            새 초대 링크를 발급했어요.
          </p>

          <InviteLinkActions
            key={mutation.data.inviteUrl}
            inviteUrl={mutation.data.inviteUrl}
            title="어디갈래? 모임 초대"
          />
        </div>
      )}

      {mutation.isError && (
        <div
          role="alert"
          className="mt-5 rounded-2xl bg-red-50 p-4 text-sm leading-7 text-red-700"
        >
          <p>
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : "초대 링크를 발급하지 못했습니다."}
          </p>

          {mutation.error instanceof ApiError &&
            mutation.error.code === "NETWORK_ERROR" && (
              <p className="mt-2">
                서버에서 링크가 변경됐을 수도 있어요. 연결이 복구되면 다시
                발급한 링크를 공유해주세요.
              </p>
            )}
        </div>
      )}

      {confirming ? (
        <div className="mt-5 rounded-2xl bg-brand-soft p-5">
          <h3 className="font-bold">초대 링크를 새로 발급할까요?</h3>

          <p className="mt-2 text-sm leading-7">
            이전에 보낸 링크로는 새로 참여할 수 없게 돼요. 새 링크를 발급한 뒤
            친구들에게 다시 보내주세요.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => {
                void handleRotate();
              }}
              className="min-h-11 rounded-xl bg-brand px-4 py-3 text-sm font-bold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? "발급 중..." : "새 링크 발급"}
            </button>

            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => {
                setConfirming(false);
              }}
              className="min-h-11 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={mutation.isPending}
          onClick={() => {
            setConfirming(true);
          }}
          className="mt-5 min-h-12 rounded-2xl border border-brand px-5 py-3 text-sm font-bold text-brand hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          초대 링크 새로 발급하기
        </button>
      )}
    </section>
  );
}
