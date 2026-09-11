const KEYS = ['etude:practice', 'etude:pieces', 'etude:exercises', 'etude:goals'] as const

interface BackupFile {
  app: 'etude'
  version: 1
  exportedAt: string
  data: Record<string, unknown>
}

function buildBackup(): BackupFile {
  const data: Record<string, unknown> = {}
  for (const key of KEYS) {
    const raw = localStorage.getItem(key)
    if (raw) {
      try {
        data[key] = JSON.parse(raw)
      } catch {
        // skip a corrupted key rather than fail the whole export
      }
    }
  }
  return { app: 'etude', version: 1, exportedAt: new Date().toISOString(), data }
}

export function downloadBackup() {
  const blob = new Blob([JSON.stringify(buildBackup(), null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `etude-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export class BackupImportError extends Error {}

export function applyBackup(json: unknown) {
  const file = json as Partial<BackupFile> | null
  if (!file || typeof file !== 'object' || file.app !== 'etude' || !file.data || typeof file.data !== 'object') {
    throw new BackupImportError('Esse arquivo não parece ser um backup do Étude.')
  }
  for (const key of KEYS) {
    if (key in file.data) localStorage.setItem(key, JSON.stringify(file.data[key]))
  }
}
