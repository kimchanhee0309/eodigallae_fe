import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "모임을 만들어요",
    description:
      "모임 이름과 닉네임을 입력하면 준비 끝. 친구들에게 보낼 초대 링크가 생겨요.",
  },
  {
    number: "02",
    title: "친구들을 초대해요",
    description:
      "단톡방에 링크를 공유해주세요. 친구들은 회원가입 없이 닉네임으로 참여해요.",
  },
  {
    number: "03",
    title: "장소를 모으고 투표해요",
    description:
      "가고 싶은 장소와 지도 링크를 올리고, 가장 마음에 드는 후보에 한 표를 보내요.",
  },
  {
    number: "04",
    title: "방장이 장소를 확정해요",
    description:
      "투표 결과를 참고해서 함께 갈 곳을 정해요. 확정된 장소는 모임 화면에서 확인해요.",
  },
];

const exampleCandidates = [
  {
    name: "이야기하기 좋은 카페",
    description: "커피 마시면서 느긋하게 수다 떨기",
    votes: 3,
    selected: true,
  },
  {
    name: "골목 안 작은 파스타집",
    description: "맛있는 저녁 먹고 산책하기",
    votes: 2,
    selected: false,
  },
  {
    name: "한강 피크닉",
    description: "돗자리 펴고 바람 쐬기",
    votes: 1,
    selected: false,
  },
];

const primaryLinkClassName =
  "inline-flex min-h-12 items-center justify-center rounded-2xl bg-brand px-6 py-3 font-bold text-white transition-colors hover:bg-brand-hover";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <header className="flex min-h-20 items-center justify-between gap-4 border-b border-border">
        <Link
          href="/"
          aria-label="어디갈래 홈"
          className="text-xl font-extrabold tracking-tight text-brand"
        >
          어디갈래?
        </Link>

        <Link
          href="/rooms/new"
          className="rounded-xl px-3 py-2 text-sm font-bold text-brand hover:bg-brand-soft"
        >
          모임 만들기 →
        </Link>
      </header>

      <main>
        <section
          aria-labelledby="intro-title"
          className="grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16"
        >
          <div>
            <p className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand">
              다음 약속, 함께 정해요
            </p>

            <h1
              id="intro-title"
              className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              “그래서 우리
              <br />
              어디서 만나?”
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-muted sm:text-lg">
              단톡방에 흩어진 장소 후보를 한곳에 모아요.
              <br className="hidden sm:block" />
              친구들과 투표하고, 이번 약속 장소를 정해보세요.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/rooms/new" className={primaryLinkClassName}>
                우리 모임 만들기
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-border bg-surface px-6 py-3 font-bold hover:bg-brand-soft"
              >
                어떻게 사용하나요?
              </a>
            </div>

            <p className="mt-4 text-sm text-muted">
              회원가입 없이, 닉네임으로 가볍게 시작해요.
            </p>
          </div>

          <aside
            aria-labelledby="preview-title"
            className="min-w-0 rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-brand">이렇게 함께 골라요</p>

              <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted">
                예시 화면
              </span>
            </div>

            <h2 id="preview-title" className="mt-5 text-2xl font-extrabold">
              토요일에 우리 만날까?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              오랜만에 모이는 친구 6명, 이번엔 어디갈래?
            </p>

            <ul className="mt-6 space-y-3">
              {exampleCandidates.map((candidate) => (
                <li
                  key={candidate.name}
                  className={`flex items-center justify-between gap-4 rounded-2xl border p-4 ${
                    candidate.selected
                      ? "border-brand bg-brand-soft"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-bold">
                      {candidate.name}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      {candidate.description}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-xl bg-surface px-3 py-2 text-sm font-bold text-brand">
                    {candidate.votes}표
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 rounded-2xl bg-background p-4 text-sm leading-6">
              <span className="font-bold text-brand">
                후보를 모으고, 한 표씩.
              </span>
              <br />
              마지막에는 방장이 만날 장소를 확정해요.
            </p>
          </aside>
        </section>

        <section
          id="how-it-works"
          aria-labelledby="steps-title"
          className="scroll-mt-8 border-t border-border py-14 sm:py-20"
        >
          <p className="text-sm font-bold text-brand">어디갈래 사용법</p>

          <h2
            id="steps-title"
            className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            링크 하나로 시작하는 우리 약속
          </h2>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li
                key={step.number}
                className="rounded-3xl border border-border bg-surface p-6"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-sm font-extrabold text-brand">
                  {step.number}
                </span>

                <h3 className="mt-5 text-lg font-bold">{step.title}</h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="start-title"
          className="mb-14 rounded-3xl border border-border bg-brand-soft px-6 py-10 text-center sm:mb-20 sm:p-12"
        >
          <h2
            id="start-title"
            className="text-2xl font-extrabold tracking-tight sm:text-3xl"
          >
            다음 모임은 어디갈래?
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted sm:text-base">
            모임을 만들고 초대 링크를 단톡방에 보내보세요.
            <br />
            장소를 고르는 일부터 함께할 수 있어요.
          </p>

          <Link href="/rooms/new" className={`mt-7 ${primaryLinkClassName}`}>
            모임 만들고 친구 초대하기
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-7 text-sm leading-6 text-muted">
        <p className="font-bold text-foreground">어디갈래?</p>
        <p className="mt-1">다음 약속을 함께 정하는 공간</p>
      </footer>
    </div>
  );
}
