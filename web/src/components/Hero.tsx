export function Hero() {
  return (
    <section className="mb-7 flex items-end justify-between sm:mb-[42px]">
      <div>
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#a45b41]">
          Shared home finances
        </p>
        <h1 className="m-0 max-w-[620px] text-[clamp(42px,6vw,72px)] font-semibold leading-[0.98] tracking-[-0.055em]">
          Keep every bill{' '}
          <em className="font-serif font-semibold not-italic text-[#a45b41]">clear.</em>
        </h1>
        <p className="mt-[22px] text-[17px] text-[#766f67]">
          Create a home, add members, split a bill, and pay each share.
        </p>
      </div>
      <div className="hidden items-end gap-2 pb-2.5 sm:flex" aria-hidden="true">
        <span className="h-[50px] w-[10px] rounded-[20px] bg-[#d3a18a]" />
        <span className="h-[72px] w-[10px] rounded-[20px] bg-[#a45b41]" />
        <span className="h-[34px] w-[10px] rounded-[20px] bg-[#e0c3b4]" />
      </div>
    </section>
  )
}
