import type { FormEvent } from 'react'
import type { Action, HomeRecord, Member } from '../types'

type Props = {
  home: HomeRecord | null
  homeId: string
  members: Member[]
  homeName: string
  memberName: string
  billTitle: string
  totalCents: string
  action: Action
  onHomeNameChange: (value: string) => void
  onMemberNameChange: (value: string) => void
  onBillTitleChange: (value: string) => void
  onTotalCentsChange: (value: string) => void
  onCreateHome: (event: FormEvent<HTMLFormElement>) => void
  onAddMember: (event: FormEvent<HTMLFormElement>) => void
  onCreateBill: (event: FormEvent<HTMLFormElement>) => void
}

export function SetupCards({
  home,
  homeId,
  members,
  homeName,
  memberName,
  billTitle,
  totalCents,
  action,
  onHomeNameChange,
  onMemberNameChange,
  onBillTitleChange,
  onTotalCentsChange,
  onCreateHome,
  onAddMember,
  onCreateBill,
}: Props) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <form
        className="relative rounded-[18px] border border-[#e8e1d8] bg-[#fffdfa] p-[21px] shadow-[0_10px_30px_rgba(62,45,31,0.04)]"
        onSubmit={onCreateHome}
      >
        <span className="absolute right-[19px] top-[13px] font-mono text-[30px] font-medium text-[#d7c6b9]">
          01
        </span>
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#a45b41]">
          Part 1 · Space
        </p>
        <h2 className="mb-[7px] text-xl font-semibold tracking-[-0.03em]">Create a space</h2>
        <p className="mb-3 min-h-[35px] text-xs leading-[1.45] text-[#8b837a]">
          Create a home, office, trip, or any shared space.
        </p>
        <input
          value={homeName}
          onChange={(event) => onHomeNameChange(event.target.value)}
          placeholder="e.g. Maple Street"
          aria-label="Space name"
          className="mb-[9px] w-full min-w-0 rounded-[10px] border border-[#ddd4c9] bg-[#f8f5f0] px-[15px] py-[13px] text-[#242323] outline-none focus:border-[#a45b41] focus:ring-2 focus:ring-[#e7c7b9]"
          required
        />
        <button
          className="min-h-10 w-full rounded-[9px] border-0 bg-[#a45b41] px-[14px] text-[13px] font-bold text-white hover:bg-[#8d4e39]"
          type="submit"
          disabled={action !== null}
        >
          {action === 'home' ? 'Creating…' : 'Create space'}
        </button>
        {home && (
          <p className="mt-2.5 block overflow-hidden text-ellipsis whitespace-nowrap rounded-md bg-[#edf2ed] p-[7px] text-[10px] text-[#4f7758]">
            Active space: {home.name}
          </p>
        )}
      </form>

      <form
        className="relative rounded-[18px] border border-[#e8e1d8] bg-[#fffdfa] p-[21px] shadow-[0_10px_30px_rgba(62,45,31,0.04)]"
        onSubmit={onAddMember}
      >
        <span className="absolute right-[19px] top-[13px] font-mono text-[30px] font-medium text-[#d7c6b9]">
          02
        </span>
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#a45b41]">
          Part 1 · Members
        </p>
        <h2 className="mb-[7px] text-xl font-semibold tracking-[-0.03em]">Add members</h2>
        <p className="mb-3 min-h-[35px] text-xs leading-[1.45] text-[#8b837a]">
          Members stay in insertion order for the bill split.
        </p>
        <input
          value={memberName}
          onChange={(event) => onMemberNameChange(event.target.value)}
          placeholder="e.g. Asha"
          aria-label="Member name"
          disabled={!homeId}
          className="mb-[9px] w-full min-w-0 rounded-[10px] border border-[#ddd4c9] bg-[#f8f5f0] px-[15px] py-[13px] text-[#242323] outline-none focus:border-[#a45b41] focus:ring-2 focus:ring-[#e7c7b9]"
          required
        />
        <button
          className="min-h-10 w-full rounded-[9px] border-0 bg-[#a45b41] px-[14px] text-[13px] font-bold text-white hover:bg-[#8d4e39]"
          type="submit"
          disabled={action !== null || !homeId}
        >
          {action === 'member' ? 'Adding…' : 'Add member'}
        </button>
        <div className="mt-[11px] flex flex-wrap gap-[5px]">
          {members.length === 0 ? (
            <span className="bg-transparent py-[5px] pr-[7px] text-[11px] text-[#958d84]">
              No members added yet
            </span>
          ) : (
            members.map((member, index) => (
              <span
                className="rounded-[5px] bg-[#f1e4dc] px-[7px] py-[5px] text-[11px] text-[#80513f]"
                key={member.id}
              >
                {index + 1}. {member.name}
              </span>
            ))
          )}
        </div>
      </form>

      <form
        className="relative rounded-[18px] border border-[#e8e1d8] bg-[#fffdfa] p-[21px] shadow-[0_10px_30px_rgba(62,45,31,0.04)]"
        onSubmit={onCreateBill}
      >
        <span className="absolute right-[19px] top-[13px] font-mono text-[30px] font-medium text-[#d7c6b9]">
          03
        </span>
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#a45b41]">
          Part 2 · Split
        </p>
        <h2 className="mb-[7px] text-xl font-semibold tracking-[-0.03em]">Create a bill</h2>
        <p className="mb-3 min-h-[35px] text-xs leading-[1.45] text-[#8b837a]">
          Enter whole cents only. 100 cents equals 1 dollar; extra cents go to earlier members.
        </p>
        <input
          value={billTitle}
          onChange={(event) => onBillTitleChange(event.target.value)}
          placeholder="e.g. Electricity"
          aria-label="Bill title"
          disabled={!homeId}
          className="mb-[9px] w-full min-w-0 rounded-[10px] border border-[#ddd4c9] bg-[#f8f5f0] px-[15px] py-[13px] text-[#242323] outline-none focus:border-[#a45b41] focus:ring-2 focus:ring-[#e7c7b9]"
          required
        />
        <input
          value={totalCents}
          onChange={(event) => onTotalCentsChange(event.target.value)}
          placeholder="Whole cents, e.g. 1000"
          aria-label="Total cents"
          inputMode="numeric"
          disabled={!homeId}
          className="mb-[9px] w-full min-w-0 rounded-[10px] border border-[#ddd4c9] bg-[#f8f5f0] px-[15px] py-[13px] text-[#242323] outline-none focus:border-[#a45b41] focus:ring-2 focus:ring-[#e7c7b9]"
          required
        />
        <button
          className="min-h-10 w-full rounded-[9px] border-0 bg-[#a45b41] px-[14px] text-[13px] font-bold text-white hover:bg-[#8d4e39]"
          type="submit"
          disabled={action !== null || !homeId || members.length === 0}
        >
          {action === 'bill' ? 'Splitting…' : 'Split bill'}
        </button>
      </form>
    </section>
  )
}
