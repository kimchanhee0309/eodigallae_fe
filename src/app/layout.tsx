import type { Metadata } from "next";
import type { ReactNode } from "react";

import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "어디갈래? | 함께 고르는 다음 모임",
    template: "%s | 어디갈래?",
  },
  description:
    "가고 싶은 장소를 모으고 친구들의 의견을 비교해 다음 모임 장소를 정해보세요.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
