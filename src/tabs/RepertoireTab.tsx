import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Plus, Trash2 } from 'lucide-react'
import { BottomSheet } from '../components/BottomSheet'
import { SCORE_SOURCES } from '../lib/theory'
import { uid, useLocalStorage, type Piece, type PieceStatus } from '../lib/storage'

const STATUS_META: Record<PieceStatus, { label: string; color: string }> = {
  'a-aprender': { label: 'A aprender', color: 'var(--color-warn)' },
  aprendendo: { label: 'Aprendendo', color: 'var(--color-accent)' },
  dominada: { label: 'Dominada', color: 'var(--color-good)' },
}
const STATUS_ORDER: PieceStatus[] = ['aprendendo', 'a-aprender', 'dominada']

export function RepertoireTab() {
  const [pieces, setPieces] = useLocalStorage<Piece[]>('etude:pieces', [])
  const [sheetOpen, setSheetOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [composer, setComposer] = useState('')
  const [status, setStatus] = useState<PieceStatus>('aprendendo')
  const [sourceName, setSourceName] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

  function resetForm() {
    setTitle('')
    setComposer('')
    setStatus('aprendendo')
    setSourceName('')
    setSourceUrl('')
  }

  function addPiece() {
    if (!title.trim()) return
    const piece: Piece = {
      id: uid(),
      title: title.trim(),
      composer: composer.trim(),
      status,
      sourceName: sourceName.trim(),
      sourceUrl: sourceUrl.trim(),
      addedAt: new Date().toISOString(),
    }
    setPieces((prev) => [piece, ...prev])
    resetForm()
    setSheetOpen(false)
  }

  function removePiece(id: string) {
    setPieces((prev) => prev.filter((p) => p.id !== id))
  }

  function cycleStatus(id: string) {
    setPieces((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const next = STATUS_ORDER[(STATUS_ORDER.indexOf(p.status) + 1) % STATUS_ORDER.length]
        return { ...p, status: next }
      }),
    )
  }

  const sorted = [...pieces].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))

  return (
    <div className="flex flex-col gap-6 pb-24">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-balance">Repertório</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-ink-dim)' }}>
            As peças que você está estudando, com a fonte de cada partitura.
          </p>
        </div>
      </header>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-dashed px-4 py-8 text-center" style={{ borderColor: 'var(--color-line)' }}>
          <p className="font-display font-semibold">Repertório vazio</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-ink-dim)' }}>
            Toque no + para adicionar a primeira peça.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {sorted.map((p) => {
            const meta = STATUS_META[p.status]
            return (
              <li key={p.id} className="rounded-2xl border p-3.5" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {p.title}
                      {p.composer && <span style={{ color: 'var(--color-ink-dim)' }}> — {p.composer}</span>}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => cycleStatus(p.id)}
                        className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                        style={{ borderColor: meta.color, color: meta.color }}
                      >
                        {meta.label}
                      </button>
                      {p.sourceUrl ? (
                        <a
                          href={p.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[12px]"
                          style={{ color: 'var(--color-ink-dim)' }}
                        >
                          {p.sourceName || 'partitura'} <ExternalLink size={11} />
                        </a>
                      ) : p.sourceName ? (
                        <span className="text-[12px]" style={{ color: 'var(--color-ink-dim)' }}>
                          {p.sourceName}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <button onClick={() => removePiece(p.id)} aria-label="Remover peça" style={{ color: 'var(--color-ink-faint)' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <section>
        <h2 className="mb-2 font-display text-sm font-semibold text-[var(--color-ink-dim)] uppercase tracking-wide">
          Onde encontrar partituras
        </h2>
        <p className="mb-3 text-xs" style={{ color: 'var(--color-ink-faint)' }}>
          Domínio público é grátis; obra recente tem direito autoral — compre a edição.
        </p>
        <ul className="flex flex-col gap-2">
          {SCORE_SOURCES.map((s) => (
            <li key={s.name} className="rounded-xl border p-3" style={{ borderColor: 'var(--color-line)' }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                {s.name} <ExternalLink size={12} style={{ color: 'var(--color-ink-faint)' }} />
              </a>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--color-ink-dim)' }}>
                {s.desc}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="pointer-events-none fixed bottom-24 left-1/2 z-20 w-full max-w-[480px] -translate-x-1/2 px-5">
        <div className="flex justify-end">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setSheetOpen(true)}
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
            style={{ background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}
            aria-label="Adicionar peça"
          >
            <Plus size={24} />
          </motion.button>
        </div>
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Nova peça">
        <div className="flex flex-col gap-3">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título — ex.: Für Elise"
            className="rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-line)' }}
          />
          <input
            value={composer}
            onChange={(e) => setComposer(e.target.value)}
            placeholder="Compositor (opcional)"
            className="rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-line)' }}
          />
          <div className="flex gap-2">
            {STATUS_ORDER.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className="flex-1 rounded-xl border py-2 text-xs font-medium"
                style={{
                  borderColor: status === s ? STATUS_META[s].color : 'var(--color-line)',
                  color: status === s ? STATUS_META[s].color : 'var(--color-ink-dim)',
                }}
              >
                {STATUS_META[s].label}
              </button>
            ))}
          </div>
          <input
            value={sourceName}
            onChange={(e) => setSourceName(e.target.value)}
            placeholder="Fonte da partitura (opcional) — ex.: IMSLP"
            className="rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-line)' }}
          />
          <input
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="Link (opcional)"
            className="rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-line)' }}
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={addPiece}
            className="rounded-xl py-3 text-center font-medium"
            style={{ background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}
          >
            Adicionar
          </motion.button>
        </div>
      </BottomSheet>
    </div>
  )
}
