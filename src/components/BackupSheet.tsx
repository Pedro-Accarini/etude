import { useRef, useState, type ChangeEvent } from 'react'
import { Download, Upload } from 'lucide-react'
import { BottomSheet } from './BottomSheet'
import { applyBackup, downloadBackup, BackupImportError } from '../lib/backup'

export function BackupSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState('')

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const text = await file.text()
      applyBackup(JSON.parse(text))
      setStatus('Backup importado — recarregando...')
      setTimeout(() => window.location.reload(), 900)
    } catch (err) {
      setStatus(err instanceof BackupImportError ? err.message : 'Não consegui ler esse arquivo.')
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Backup dos seus dados">
      <div className="flex flex-col gap-3">
        <p className="text-sm" style={{ color: 'var(--color-ink-dim)' }}>
          Diário de prática, repertório, exercícios e metas ficam salvos só neste aparelho. Exporte de vez
          em quando para não perder tudo se limpar o navegador ou trocar de computador/tablet.
        </p>
        <button
          onClick={downloadBackup}
          className="flex items-center justify-center gap-2 rounded-xl py-3 font-medium"
          style={{ background: 'var(--gradient-brand)', color: 'var(--color-accent-ink)' }}
        >
          <Download size={17} /> Exportar backup (.json)
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-xl border py-3 font-medium"
          style={{ borderColor: 'var(--color-line)' }}
        >
          <Upload size={17} /> Importar backup
        </button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleFile} />
        {status && (
          <p className="text-xs" style={{ color: 'var(--color-ink-dim)' }}>
            {status}
          </p>
        )}
      </div>
    </BottomSheet>
  )
}
