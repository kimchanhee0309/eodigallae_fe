"use client";

import { useId, useRef } from "react";

export type MenuDraft = {
  id: number;
  name: string;
  price: string;
  priceBasis: string;
};

type CandidateMenuFieldsProps = {
  menus: MenuDraft[];
  onChange: (menus: MenuDraft[]) => void;
};

const inputClassName =
  "mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3";

export default function CandidateMenuFields({
  menus,
  onChange,
}: CandidateMenuFieldsProps) {
  const prefix = useId();
  const nextId = useRef(0);

  function addMenu() {
    if (menus.length >= 3) {
      return;
    }

    const id = nextId.current;
    nextId.current += 1;

    onChange([
      ...menus,
      {
        id,
        name: "",
        price: "",
        priceBasis: "1개",
      },
    ]);
  }

  function updateMenu(
    id: number,
    field: "name" | "price" | "priceBasis",
    value: string,
  ) {
    onChange(
      menus.map((menu) =>
        menu.id === id ? { ...menu, [field]: value } : menu,
      ),
    );
  }

  return (
    <div className="rounded-2xl border border-border p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="font-bold">
          대표 메뉴 · 선택
          <span className="ml-2 text-sm text-muted">{menus.length}/3</span>
        </h4>

        <button
          type="button"
          disabled={menus.length >= 3}
          onClick={addMenu}
          className="min-h-11 rounded-xl border border-brand px-3 py-2 text-sm font-bold text-brand hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity:50"
        >
          + 메뉴 추가
        </button>
      </div>

      <p className="mt-2 text-sm leading-7 text-muted">
        가격을 모르면 비워두세요. 1인분·1잔·2인 세트처럼 가격이 어떤 기준인지
        함께 적어주세요.
      </p>

      <div className="space-y-4">
        {menus.map((menu, index) => {
          const baseId = `${prefix}-${menu.id}`;

          return (
            <fieldset
              key={menu.id}
              className="mt-4 min-w-0 rounded-2xl bg-background p-4"
            >
              <legend className="px-1 text-sm font-bold">
                메뉴 {index + 1}
              </legend>

              <div>
                <label
                  htmlFor={`${baseId}-name`}
                  className="text-sm font-semibold"
                >
                  메뉴명
                </label>

                <input
                  id={`${baseId}-name`}
                  type="text"
                  required
                  maxLength={100}
                  value={menu.name}
                  onChange={(event) =>
                    updateMenu(menu.id, "name", event.target.value)
                  }
                  placeholder="예: 토마토 파스타"
                  className={inputClassName}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${baseId}-price`}
                    className="text-sm font-semibold"
                  >
                    가격 · 원
                  </label>

                  <input
                    id={`${baseId}-price`}
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={menu.price}
                    onChange={(event) =>
                      updateMenu(menu.id, "price", event.target.value)
                    }
                    placeholder="예: 15000 · 미확인은 공란"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${baseId}-basis`}
                    className="text-sm font-semibold"
                  >
                    가격 기준
                  </label>

                  <input
                    id={`${baseId}-basis`}
                    type="text"
                    required
                    maxLength={30}
                    value={menu.priceBasis}
                    onChange={(event) =>
                      updateMenu(menu.id, "priceBasis", event.target.value)
                    }
                    placeholder="예: 1인분, 1잔, 2인 세트"
                    className={inputClassName}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onChange(menus.filter((item) => item.id !== menu.id))
                }
                aria-label={`메뉴 ${index + 1} 입력란 삭제`}
                className="mt-3 min-h-11 rounded-xl px-3 py-2 text-sm text-muted hover:bg-surface hover:text-red-700"
              >
                이 메뉴 삭제
              </button>
            </fieldset>
          );
        })}
      </div>
    </div>
  );
}
