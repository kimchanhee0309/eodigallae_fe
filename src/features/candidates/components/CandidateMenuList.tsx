import type { CandidateMenu } from "../schemas";

type CandidateMenuListProps = {
  menus: CandidateMenu[];
};

const priceFormatter = new Intl.NumberFormat("ko-KR");

export default function CandidateMenuList({ menus }: CandidateMenuListProps) {
  if (menus.length === 0) {
    return (
      <p className="mt-4 text-sm text-muted">등록된 메뉴·가격 정보가 없어요.</p>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-border bg-background p-4">
      <h4 className="text-sm font-bold">대표 메뉴</h4>

      <ul className="mt-3 space-y-3">
        {menus.map((menu) => (
          <li
            key={menu.id}
            className="min-w-0 border-t border-border pt-3 first:border-t-0 first:pt-0"
          >
            <p className="break-words text-sm font-semibold">{menu.name}</p>

            <p className="mt-1 break-words text-sm">
              <span className="font-bold text-brand">
                {menu.price === null
                  ? "가격 미확인"
                  : `${priceFormatter.format(menu.price)}원`}
              </span>

              <span className="ml-2 text-muted">/ {menu.priceBasis}</span>
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-6 text-muted">
        참여자가 입력한 정보예요. 실제 메뉴와 가격은 매장에서 확인해주세요.
      </p>
    </div>
  );
}
