import type { ReactNode } from "react";

export function PageShell({ children, narrow = false }: { children: ReactNode; narrow?: boolean }) {
  return <div className={`mx-auto px-[22px] py-10 tablet:py-14 ${narrow ? "max-w-[680px]" : "max-w-[1024px]"}`}>{children}</div>;
}

export function PageTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-8">
      <h1 className="m-0 font-display text-[40px] leading-[1.1] font-semibold tracking-normal tablet:text-5xl">{children}</h1>
      {sub ? <p className="mt-2 mb-0 font-display text-xl text-[#6e6e73]">{sub}</p> : null}
    </div>
  );
}
