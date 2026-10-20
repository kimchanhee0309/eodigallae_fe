import type { Metadata } from "next";
import Link from "next/link";

import CreateRoomForm from "@/features/rooms/components/CreateRoomForm";

export const metadata: Metadata = {
  title: "모임 만들기",
};

export default function CreateRoomPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
      <Link
        href="/"
        className="text-sm font-semibold text-muted hover:text-brand"
      >
        ← 홈으로
      </Link>

      <header className="mb-8 mt-8">
        <p className="text-sm font-bold text-brand">새로운 약속의 시작</p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          이번엔 어디서 만날까요?
        </h1>

        <p className="mt-4 leading-7 text-muted">
          모임을 만들고 친구들과 가고 싶은 곳을 골라보세요.
        </p>
      </header>

      <CreateRoomForm />
    </main>
  );
}
