import type { HomeRecord } from '../types'

type Props = {
  home: HomeRecord | null
  homeId: string
  workspaces: HomeRecord[]
  isLoading: boolean
  onSelect: (id: string) => void
  onRefresh: () => void
}

export function WorkspaceSwitcher({
  home,
  homeId,
  workspaces,
  isLoading,
  onSelect,
  onRefresh,
}: Props) {
  return (
    <section className="mb-7 rounded-[18px] border border-[#e8e1d8] bg-[#fffdfa] p-[22px] shadow-[0_10px_30px_rgba(62,45,31,0.04)] sm:px-6">
      <div className="mb-[14px] flex items-end justify-between gap-5">
        <div>
          <div className="mb-[9px] text-[13px] font-bold">Your spaces</div>
          <p className="m-0 text-xs text-[#958d84]">
            Switch between your saved homes, offices, and other spaces.
          </p>
        </div>
      </div>
      <ul className="mb-3 flex list-none flex-wrap gap-2 p-0" aria-label="Your spaces">
        {workspaces.length === 0 ? (
          <li className="py-2 text-xs text-[#958d84]">
            No spaces created yet. Create your first space above.
          </li>
        ) : (
          workspaces.map((workspace) => (
            <li key={workspace.id}>
              <button
                type="button"
                className={`rounded-[9px] border px-[14px] py-[10px] text-[13px] font-semibold transition-colors ${workspace.id === homeId ? 'border-[#c98d76] bg-[#f1e0d7] text-[#8d4e39]' : 'border-[#ddd4c9] bg-[#f8f5f0] text-[#6f6259] hover:border-[#c98d76] hover:bg-[#f1e0d7] hover:text-[#8d4e39]'}`}
                onClick={() => onSelect(workspace.id)}
              >
                {workspace.name}
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <button
          className="min-h-[45px] rounded-[10px] border-0 bg-[#a45b41] px-[21px] font-bold text-white hover:bg-[#8d4e39] disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={onRefresh}
          disabled={isLoading || !homeId}
        >
          {isLoading ? 'Loading…' : 'Refresh space'}
        </button>
      </div>
      {home && <p className="mt-[9px] text-xs text-[#958d84]">Active space: {home.name}</p>}
    </section>
  )
}
