import type { HomeRecord } from './types'

const WORKSPACES_STORAGE_KEY = 'bill-splitter-workspaces'

export function readWorkspaces(): HomeRecord[] {
  try {
    const saved = JSON.parse(localStorage.getItem(WORKSPACES_STORAGE_KEY) ?? '[]')
    return Array.isArray(saved)
      ? saved.filter(
          (item): item is HomeRecord =>
            typeof item?.id === 'string' && typeof item?.name === 'string',
        )
      : []
  } catch {
    return []
  }
}

export function saveWorkspaces(workspaces: HomeRecord[]) {
  localStorage.setItem(WORKSPACES_STORAGE_KEY, JSON.stringify(workspaces))
}
