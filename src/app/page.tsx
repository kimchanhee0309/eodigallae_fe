import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "가고 싶은 곳 모으기",
    description: "단톡방에 흩어진 식당, 카페, 숙소 링크를 한곳에 담아요.",
  },
  {
    number: "02",
    title: "서로의 생각 확인하기",
    description: "좋은 곳과 어려운 곳, 그 이유까지 편하게 남겨요.",
  },
  {
    number: "03",
    title: "우리의 다음 장소 정하기",
    description: "친구들의 의견을 비교하고 함께 갈 곳을 결정해요.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <header className="flex h-20 items-center border-b border-border">
        <span className="text-xl font-extrabold tracking-tight text-brand">
          어디갈래?
        </span>
      </header>

      <main className="py-16 sm:py-24">
        <section aria-labelledby="intro-title">
          <p className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand">
            함께 고르는 다음 모임
          </p>

          <h1
            id="intro-title"
            className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
          >
            어디 갈지 고민될 땐,
            <br />
            우리 같이 골라요.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
            “여기 어때?” 하고 보낸 링크들.
            <br />
            한곳에 모으고, 의견을 나누고, 다음 약속을 정해요.
          </p>
          <div className="mt-8">
            <Link
              href="/rooms/new"
              className="inline-flex items-center justify-center rounded-2xl bg-brand px-6 py-4 font-bold text-white transition-colors hover:bg-brand-hover"
            >
              모임 만들기
            </Link>
          </div>
        </section>

        <section aria-labelledby="steps-title" className="mt-16 sm:mt-24">
          <h2 id="steps-title" className="text-xl font-bold">
            복잡한 계획 대신, 세 단계면 충분해요
          </h2>

          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.number}
                className="rounded-3xl border border-border bg-surface p-7"
              >
                <span className="text-sm font-bold text-brand">
                  {step.number}
                </span>

                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-sm text-muted">
        어디갈래? · 다음 약속을 함께 정하는 공간
      </footer>
    </div>
  );
}
