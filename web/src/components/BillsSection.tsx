import type { Bill } from '../types'

type Props = {
  bills: Bill[]
  memberNames: Record<string, string>
  totalOutstanding: number
  onRefresh: () => void
  onPay: (billId: string, shareId: string) => void
  payingShareId: string | null
}

function formatCents(cents: number) {
  return `${new Intl.NumberFormat('en-US').format(cents)} cents`
}

export function BillsSection({
  bills,
  memberNames,
  totalOutstanding,
  onRefresh,
  onPay,
  payingShareId,
}: Props) {
  return (
    <section className="grid items-start gap-[27px] lg:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <div className="mb-[15px] flex items-end justify-between">
          <div>
            <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#a45b41]">
              Part 2 · Pay
            </p>
            <h2 className="m-0 text-[27px] font-semibold tracking-[-0.04em]">Household bills</h2>
          </div>
          <button
            type="button"
            className="rounded-[9px] border border-[#d5c7bb] bg-transparent px-[11px] py-2 text-xs font-bold text-[#7d4938] hover:bg-[#f1e4dc]"
            onClick={onRefresh}
          >
            ↻ Refresh
          </button>
        </div>
        {bills.map((bill) => (
          <article
            className="mb-4 overflow-hidden rounded-[18px] border border-[#e8e1d8] bg-[#fffdfa] shadow-[0_10px_30px_rgba(62,45,31,0.04)]"
            key={bill.id}
          >
            <div className="flex items-center gap-[13px] px-4 py-5 sm:px-[21px]">
              <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-xl bg-[#ead4c7] text-xl font-bold text-[#8e4d39]">
                {bill.title.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <h3 className="mb-1 text-[17px] font-semibold">{bill.title}</h3>
                <p className="m-0 text-xs text-[#958d84]">{bill.shares.length} shares</p>
              </div>
              <strong className="ml-auto font-mono text-base">
                {formatCents(bill.totalCents)}
              </strong>
            </div>
            <div className="border-t border-[#eee8e0] px-3 py-[3px] sm:px-[21px]">
              {bill.shares.map((share, index) => (
                <div
                  className={`flex min-h-[68px] items-center gap-2 border-b border-[#f0ebe5] last:border-b-0 sm:gap-[11px] ${share.paidAt ? 'text-[#7b8b7d]' : ''}`}
                  key={share.id}
                >
                  <div
                    className={`flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full font-mono text-xs ${share.paidAt ? 'bg-[#edf2ed] text-[#51715e]' : 'bg-[#e9eee9] text-[#51715e]'}`}
                  >
                    {String.fromCharCode(65 + (index % 26))}
                  </div>
                  <div className="flex min-w-0 flex-col gap-[3px]">
                    <strong className="text-[13px]">
                      {memberNames[share.memberId] ?? `Member ${index + 1}`}
                    </strong>
                    <span className="text-xs text-[#958d84]">
                      {share.paidAt ? 'Paid' : 'Awaiting payment'}
                    </span>
                  </div>
                  <strong className="ml-auto whitespace-nowrap font-mono text-[13px]">
                    {formatCents(share.amountCents)}
                  </strong>
                  {share.paidAt ? (
                    <span className="whitespace-nowrap rounded-md bg-[#e9f1e9] px-[9px] py-[7px] text-[11px] font-bold text-[#4f7758]">
                      Paid ✓
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="whitespace-nowrap rounded-[10px] border-0 bg-[#a45b41] px-2 py-[7px] text-[11px] font-bold text-white hover:bg-[#8d4e39] sm:px-[10px]"
                      onClick={() => onPay(bill.id, share.id)}
                      disabled={payingShareId !== null}
                    >
                      {payingShareId === share.id ? 'Paying…' : 'Pay share'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      <aside className="rounded-[18px] border border-[#e8e1d8] bg-[#fffdfa] p-6 shadow-[0_10px_30px_rgba(62,45,31,0.04)] lg:sticky lg:top-5">
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#a45b41]">
          Your snapshot
        </p>
        <h2 className="mb-[13px] text-xl font-semibold">Outstanding</h2>
        <p className="mb-[5px] font-mono text-[33px] text-[#a45b41]">
          {formatCents(totalOutstanding)}
        </p>
        <p className="text-xs leading-[1.5] text-[#8b837a]">
          Across {bills.length} {bills.length === 1 ? 'bill' : 'bills'} in this space.
        </p>
        <div className="my-[18px] border-t border-[#e8e1d8]" />
        <p className="m-0 text-xs leading-[1.5] text-[#8b837a]">
          Payments are recorded securely and cannot be charged twice.
        </p>
      </aside>
    </section>
  )
}
