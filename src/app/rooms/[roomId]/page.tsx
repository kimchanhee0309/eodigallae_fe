import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";

import RoomDetail from "@/features/rooms/components/RoomDetail";

export const metadata: Metadata = {
  title: "모임 상세",
  robots: {
    index: false,
    follow: false,
  },
  referrer: "no-referrer",
};

type RoomDetailPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

async function RoomDetailContent({ params }: RoomDetailPageProps) {
  const { roomId } = await params;

  const result = z.string().uuid().safeParse(roomId);

  if (!result.success) {
    notFound();
  }

  return <RoomDetail roomId={result.data.toLowerCase()} />;
}

function RoomDetailFallback() {
  return (
    <div
      role="status"
      className="rounded-3xl border border-border bg-surface p-8 text-muted"
    >
      모임 화면을 준비하고 있어요…
    </div>
  );
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:py-16">
      <Link
        href="/"
        className="text-sm font-semibold text-muted hover:text-brand"
      >
        ← 홈으로
      </Link>

      <div className="mt-8">
        <Suspense fallback={<RoomDetailFallback />}>
          <RoomDetailContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
