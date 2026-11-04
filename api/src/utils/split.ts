export function splitCents(totalCents: number, count: number): number[] {
  if (!Number.isSafeInteger(totalCents) || totalCents < 0) {
    throw new RangeError('totalCents must be a non-negative whole number')
  }
  if (!Number.isSafeInteger(count) || count < 1) {
    throw new RangeError('count must be a positive whole number')
  }

  const base = Math.floor(totalCents / count)
  const remainder = totalCents % count

  return Array.from({ length: count }, (_, index) => (index < remainder ? base + 1 : base))
}
