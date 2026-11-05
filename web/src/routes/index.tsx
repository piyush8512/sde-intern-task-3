import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { FormEvent } from 'react'
import { useRef, useState } from 'react'
import {
  addMemberRequest,
  createBillRequest,
  getHomeData,
  type HomeData,
  payShareRequest,
  requestJson,
} from '../api'
import { BillsSection } from '../components/BillsSection'
import { Hero } from '../components/Hero'
import { SetupCards } from '../components/SetupCards'
import { WorkspaceSwitcher } from '../components/WorkspaceSwitcher'
import { readWorkspaces, saveWorkspaces } from '../storage'
import type { Action, HomeRecord, Member } from '../types'
import './index.css'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const queryClient = useQueryClient()
  const [workspaces, setWorkspaces] = useState<HomeRecord[]>(readWorkspaces)
  const [homeId, setHomeId] = useState(() => readWorkspaces()[0]?.id ?? '')
  const [homeName, setHomeName] = useState('')
  const [memberName, setMemberName] = useState('')
  const [billTitle, setBillTitle] = useState('')
  const [totalCents, setTotalCents] = useState('')
  const [action, setAction] = useState<Action>(null)
  const [error, setError] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [payingShareId, setPayingShareId] = useState<string | null>(null)
  const paymentKeys = useRef(new Map<string, string>())
  const homeQueryKey = ['home-data', homeId] as const

  const homeQuery = useQuery({
    queryKey: homeQueryKey,
    queryFn: () => getHomeData(homeId),
    enabled: Boolean(homeId),
  })

  const createHomeMutation = useMutation({
    mutationFn: (name: string) =>
      requestJson<HomeRecord>('/api/homes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }),
  })
  const addMemberMutation = useMutation({
    mutationFn: ({ name }: { name: string }) => addMemberRequest(homeId, name),
  })
  const createBillMutation = useMutation({
    mutationFn: ({ title, cents }: { title: string; cents: number }) =>
      createBillRequest(homeId, title, cents),
  })
  const payShareMutation = useMutation({
    mutationFn: ({
      billId,
      shareId,
      idempotencyKey,
    }: {
      billId: string
      shareId: string
      idempotencyKey: string
    }) => payShareRequest(billId, shareId, idempotencyKey),
    onSuccess: (paidShare) => {
      queryClient.setQueryData<HomeData>(homeQueryKey, (current) => {
        if (!current) return current
        return {
          ...current,
          bills: current.bills.map((bill) => ({
            ...bill,
            shares: bill.shares.map((share) => (share.id === paidShare.id ? paidShare : share)),
          })),
        }
      })
      void queryClient.invalidateQueries({ queryKey: homeQueryKey })
    },
  })

  const home = homeQuery.data?.home ?? null
  const bills = homeQuery.data?.bills ?? []
  const members: Member[] =
    homeQuery.data?.balances.map((balance) => ({
      id: balance.memberId,
      homeId,
      name: balance.name,
    })) ?? []
  const memberNames = Object.fromEntries(
    (homeQuery.data?.balances ?? []).map((balance) => [balance.memberId, balance.name]),
  )
  const isLoading = Boolean(homeId) && homeQuery.isPending
  const totalOutstanding = bills.reduce(
    (total, bill) =>
      total +
      bill.shares.reduce(
        (billTotal, share) => billTotal + (share.paidAt ? 0 : share.amountCents),
        0,
      ),
    0,
  )

  function showError(requestError: unknown, fallback: string) {
    setError(requestError instanceof Error ? requestError.message : fallback)
  }

  async function createHome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAction('home')
    setError(null)
    try {
      const created = await createHomeMutation.mutateAsync(homeName)
      const nextWorkspaces = [
        created,
        ...workspaces.filter((workspace) => workspace.id !== created.id),
      ]
      setWorkspaces(nextWorkspaces)
      saveWorkspaces(nextWorkspaces)
      setHomeId(created.id)
      setHomeName('')
    } catch (requestError) {
      showError(requestError, 'Could not create space')
    } finally {
      setAction(null)
    }
  }

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!homeId) return
    setAction('member')
    setError(null)
    try {
      await addMemberMutation.mutateAsync({ name: memberName })
      setMemberName('')
      void queryClient.invalidateQueries({ queryKey: homeQueryKey })
    } catch (requestError) {
      showError(requestError, 'Could not add member')
    } finally {
      setAction(null)
    }
  }

  async function createBill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!homeId) return
    const cents = Number(totalCents)
    if (!Number.isSafeInteger(cents) || cents <= 0) {
      setError('Total must be a positive whole number of cents.')
      return
    }
    setAction('bill')
    setError(null)
    try {
      await createBillMutation.mutateAsync({ title: billTitle, cents })
      setBillTitle('')
      setTotalCents('')
      void queryClient.invalidateQueries({ queryKey: homeQueryKey })
    } catch (requestError) {
      showError(requestError, 'Could not create bill')
    } finally {
      setAction(null)
    }
  }

  async function payShare(billId: string, shareId: string) {
    const paymentKey = `${billId}:${shareId}`
    let idempotencyKey = paymentKeys.current.get(paymentKey)
    if (!idempotencyKey) {
      idempotencyKey = crypto.randomUUID()
      paymentKeys.current.set(paymentKey, idempotencyKey)
    }

    setPayingShareId(shareId)
    setPaymentError(null)
    try {
      await payShareMutation.mutateAsync({ billId, shareId, idempotencyKey })
      paymentKeys.current.delete(paymentKey)
    } catch (requestError) {
      setPaymentError(
        requestError instanceof Error ? requestError.message : 'Payment failed. Please try again.',
      )
    } finally {
      setPayingShareId(null)
    }
  }

  return (
    <main className="mx-auto max-w-[1180px] px-4 pb-14 pt-8 sm:px-7 sm:pb-20 sm:pt-[52px]">
      <Hero />
      <SetupCards
        home={home}
        homeId={homeId}
        members={members}
        homeName={homeName}
        memberName={memberName}
        billTitle={billTitle}
        totalCents={totalCents}
        action={action}
        onHomeNameChange={setHomeName}
        onMemberNameChange={setMemberName}
        onBillTitleChange={setBillTitle}
        onTotalCentsChange={setTotalCents}
        onCreateHome={(event) => void createHome(event)}
        onAddMember={(event) => void addMember(event)}
        onCreateBill={(event) => void createBill(event)}
      />
      <WorkspaceSwitcher
        home={home}
        homeId={homeId}
        workspaces={workspaces}
        isLoading={homeQuery.isFetching}
        onSelect={setHomeId}
        onRefresh={() => void homeQuery.refetch()}
      />
      {homeQuery.error && !homeQuery.data && (
        <div
          className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#edc8bd] bg-[#fff0ed] px-4 py-3 text-[#8d3f32]"
          role="alert"
        >
          <strong>Request failed.</strong>
          <span>{homeQuery.error.message}</span>
        </div>
      )}
      {error && (
        <div
          className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#edc8bd] bg-[#fff0ed] px-4 py-3 text-[#8d3f32]"
          role="alert"
        >
          <strong>Request failed.</strong>
          <span>{error}</span>
          <button
            className="ml-auto border-0 bg-transparent text-[22px]"
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
      {paymentError && (
        <div
          className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#edc8bd] bg-[#fff0ed] px-4 py-3 text-[#8d3f32]"
          role="alert"
        >
          <strong>Payment could not be completed.</strong>
          <span>{paymentError} The share remains unpaid.</span>
          <button
            className="ml-auto border-0 bg-transparent text-[22px] text-inherit"
            type="button"
            onClick={() => setPaymentError(null)}
            aria-label="Dismiss payment error"
          >
            ×
          </button>
        </div>
      )}
      {isLoading && (
        <section
          className="rounded-[18px] border border-[#e8e1d8] bg-[#fffdfa] p-[55px_25px] text-center shadow-[0_10px_30px_rgba(62,45,31,0.04)]"
          aria-live="polite"
        >
          <div className="mx-auto mb-5 h-[35px] w-[35px] animate-spin rounded-full border-[3px] border-[#eadbd2] border-t-[#a45b41]" />
          <h2 className="mb-2 text-[22px] font-semibold">Loading your bills</h2>
          <p className="mb-[22px] text-[#817970]">Getting the latest household balance…</p>
        </section>
      )}
      {!homeId && (
        <section className="rounded-[18px] border border-[#e8e1d8] bg-[#fffdfa] px-6 py-12 text-center shadow-[0_10px_30px_rgba(62,45,31,0.04)]">
          <h2 className="mb-2 text-[22px] font-semibold">Create your first space</h2>
          <p className="m-0 text-[#817970]">
            Use the first card above to create a home before adding members and bills.
          </p>
        </section>
      )}
      {!isLoading && !homeQuery.error && homeId && bills.length === 0 && (
        <section className="rounded-[18px] border border-[#e8e1d8] bg-[#fffdfa] p-[55px_25px] text-center shadow-[0_10px_30px_rgba(62,45,31,0.04)]">
          <div className="mx-auto mb-[18px] flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#f1e4dc] text-[31px] text-[#a45b41]">
            ○
          </div>
          <h2 className="mb-2 text-[22px] font-semibold">No bills yet</h2>
          <p className="mb-[22px] text-[#817970]">
            Add at least one member, then create a bill in step 03.
          </p>
        </section>
      )}
      {!isLoading && !homeQuery.error && bills.length > 0 && (
        <BillsSection
          bills={bills}
          memberNames={memberNames}
          totalOutstanding={totalOutstanding}
          onRefresh={() => void homeQuery.refetch()}
          onPay={(billId, shareId) => void payShare(billId, shareId)}
          payingShareId={payingShareId}
        />
      )}
    </main>
  )
}
