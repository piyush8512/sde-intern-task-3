import type { Balance, Bill, HomeRecord, Member, Share } from './types'

type ApiError = { error?: string }

export async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const body = (await response.json().catch(() => null)) as T | ApiError | null
  if (!response.ok) {
    throw new Error(
      body && typeof body === 'object' && 'error' in body && body.error
        ? body.error
        : 'The request could not be completed',
    )
  }
  return body as T
}

export type HomeData = {
  bills: Bill[]
  home: HomeRecord
  balances: Balance[]
}

export async function getHomeData(homeId: string): Promise<HomeData> {
  const encodedHomeId = encodeURIComponent(homeId)
  const [billBody, home, balanceBody] = await Promise.all([
    requestJson<{ bills: Bill[] }>(`/api/homes/${encodedHomeId}/bills`),
    requestJson<HomeRecord>(`/api/homes/${encodedHomeId}`),
    requestJson<{ balances: Balance[] }>(`/api/homes/${encodedHomeId}/balances`),
  ])
  return {
    bills: Array.isArray(billBody.bills) ? billBody.bills : [],
    home,
    balances: Array.isArray(balanceBody.balances) ? balanceBody.balances : [],
  }
}

export function addMemberRequest(homeId: string, name: string) {
  return requestJson<Member>(`/api/homes/${encodeURIComponent(homeId)}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
}

export function createBillRequest(homeId: string, title: string, totalCents: number) {
  return requestJson<Bill>(`/api/homes/${encodeURIComponent(homeId)}/bills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, totalCents }),
  })
}

export function payShareRequest(billId: string, shareId: string, idempotencyKey: string) {
  return requestJson<Share>(
    `/api/bills/${encodeURIComponent(billId)}/shares/${encodeURIComponent(shareId)}/pay`,
    { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey } },
  )
}
