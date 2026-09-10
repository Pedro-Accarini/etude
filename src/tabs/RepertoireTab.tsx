import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Plus, Trash2 } from 'lucide-react'
import { BottomSheet } from '../components/BottomSheet'
import { SCORE_SOURCES } from '../lib/theory'
import { sourceLabel, uid, useLocalStorage, type Piece, type PieceStatus } from '../lib/storage'

const LANES: { status: PieceStatus; label: string; color: string; ink: string }[] = [
  { status: 'a-aprender', label: 'A aprender', color: 'var(--color-accent-2)', ink: 'var(--color-accent-2-ink)' },
  { status: 'aprendendo', label: 'Aprendendo', color: 'var(--color-accent)', ink: 'var(--color-accent-ink)' },
  { status: 'dominada', label: 'Dominada', color: 'var(--color-good)', ink: 'var(--color-good-ink)' },
]

export function RepertoireTab() {
  const [pieces, setPieces] = useLocalStorage<Piece[]>('etude:pieces', [])
  const [addingFor, setAddingFor] = useState<PieceStatus | null>(null)
  const [editing, setEditing] = useState<Piece | null>(null)

  function addPiece(status: PieceStatus, title: string, sourceUrl: string) {
    const piece: Piece = {
      id: uid(),
      title: title.trim(),
      composer: '',
      status,
      sourceUrl: sourceUrl.trim(),
      addedAt: new Date().toISOString(),
    }
    setPieces((prev) => [piece, ...prev])
    setAddingFor(null)
  }

  function updatePiece(id: string, patch: Partial<Piece>) {
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  function removePiece(id: string) {
    setPieces((prev) => prev.filter((p) => p.id !== id))
    setEditing(null)
  }

  return (
    <div className="flex flex-col gap-7 pb-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-balance">Repertório</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-ink-dim)' }}>
          Da primeira leitura até dominar — arraste o dedo para o lado em cada prateleira.
        </p>
      </header>

      {LANES.map((lane) => {
        const items = pieces.filter((p) => p.status === lane.status)
        return (
          <section key={lane.status}>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: lane.color }} />
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-ink-dim)' }}>
                {lane.label}
              </h2>
              <span className="font-mono text-xs" style={{ color: 'var(--color-ink-faint)' }}>
                {items.length}
              </span>
            </div>
            <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1" style={{ scrollSnapType: 'x proximity' }}>
              {items.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setEditing(p)}
                  className="flex w-36 shrink-0 flex-col items-start gap-1.5 rounded-2xl border p-3 text-left"
                  style={{ background: 'var(--color-surface)', borderColor: 'var(--color-line)', borderTop: `2.5px solid ${lane.color}`, scrollSnapAlign: 'start' }}
                >
                  <p className="line-clamp-2 text-sm font-medium">{p.title}</p>
                  {p.composer && (
                    <p className="line-clamp-1 text-xs" style={{ color: 'var(--color-ink-dim)' }}>
                      {p.composer}
                    </p>
                  )}
                  {p.sourceUrl && (
                    <span className="mt-auto flex items-center gap-1 pt-1 text-[11px]" style={{ color: 'var(--color-ink-faint)' }}>
                      <ExternalLink size={10} /> {sourceLabel(p.sourceUrl)}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={() => setAddingFor(lane.status)}
                className="flex w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-dashed py-4"
                style={{ borderColor: lane.color, color: lane.color, scrollSnapAlign: 'start' }}
              >
                <Plus size={17} />
                <span className="text-[11px] font-medium">Nova peça</span>
              </button>
            </div>
          </section>
        )
      })}

      <section>
        <h2 className="mb-2 font-display text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-ink-dim)' }}>
          Onde encontrar partituras
        </h2>
        <p className="mb-3 text-xs" style={{ color: 'var(--color-ink-faint)' }}>
          Domínio público é grátis; obra recente tem direito autoral — compre a edição.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {SCORE_SOURCES.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border p-2.5"
              style={{ borderColor: 'var(--color-line)' }}
            >
              <span className="flex items-center gap-1 text-xs font-medium">
                {s.name} <ExternalLink size={10} style={{ color: 'var(--color-ink-faint)' }} />
              </span>
              <p className="mt-0.5 text-[11px]" style={{ color: 'var(--color-ink-dim)' }}>
                {s.desc}
              </p>
            </a>
          ))}
        </div>
      </section>

      <AddSheet lane={LANES.find((l) => l.status === addingFor) ?? null} onClose={() => setAddingFor(null)} onAdd={addPiece} />
      <EditSheet piece={editing} onClose={() => setEditing(null)} onSave={updatePiece} onDelete={removePiece} />
    </div>
  )
}

function AddSheet({
  lane,
  onClose,
  onAdd,
}: {
  lane: { status: PieceStatus; label: string; color: string; ink: string } | null
  onClose: () => void
  onAdd: (status: PieceStatus, title: string, sourceUrl: string) => void
}) {
  const [title, setTitle] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')

  function submit() {
    if (!lane || !title.trim()) return
    onAdd(lane.status, title, sourceUrl)
    setTitle('')
    setSourceUrl('')
  }

  return (
    <BottomSheet open={!!lane} onClose={onClose} title={lane ? `Nova peça — ${lane.label}` : ''}>
      <div className="flex flex-col gap-3">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Título — ex.: Für Elise"
          className="rounded-xl border px-3 py-2.5 text-sm outline-none"
          style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-line)' }}
        />
        <input
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="Link da partitura (opcional)"
          className="rounded-xl border px-3 py-2.5 text-sm outline-none"
          style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-line)' }}
        />
        <p className="text-xs" style={{ color: 'var(--color-ink-faint)' }}>
          Compositor e status você ajusta depois, tocando na peça.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={submit}
          className="rounded-xl py-3 text-center font-medium"
          style={{ background: lane?.color, color: lane?.ink }}
        >
          Adicionar
        </motion.button>
      </div>
    </BottomSheet>
  )
}

function EditSheet({
  piece,
  onClose,
  onSave,
  onDelete,
}: {
  piece: Piece | null
  onClose: () => void
  onSave: (id: string, patch: Partial<Piece>) => void
  onDelete: (id: string) => void
}) {
  const [lastPiece, setLastPiece] = useState<Piece | null>(piece)
  useEffect(() => {
    if (piece) setLastPiece(piece)
  }, [piece])

  return (
    <BottomSheet open={!!piece} onClose={onClose} title="Editar peça">
      {lastPiece && <EditForm key={lastPiece.id} piece={lastPiece} onSave={onSave} onDelete={onDelete} />}
    </BottomSheet>
  )
}

function EditForm({
  piece,
  onSave,
  onDelete,
}: {
  piece: Piece
  onSave: (id: string, patch: Partial<Piece>) => void
  onDelete: (id: string) => void
}) {
  const [title, setTitle] = useState(piece.title)
  const [composer, setComposer] = useState(piece.composer)
  const [status, setStatus] = useState<PieceStatus>(piece.status)
  const [sourceUrl, setSourceUrl] = useState(piece.sourceUrl)

  function save() {
    onSave(piece.id, { title: title.trim(), composer: composer.trim(), status, sourceUrl: sourceUrl.trim() })
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-xl border px-3 py-2.5 text-sm outline-none"
        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-line)' }}
      />
      <input
        value={composer}
        onChange={(e) => setComposer(e.target.value)}
        placeholder="Compositor"
        className="rounded-xl border px-3 py-2.5 text-sm outline-none"
        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-line)' }}
      />
      <div className="flex gap-2">
        {LANES.map((l) => (
          <button
            key={l.status}
            onClick={() => setStatus(l.status)}
            className="flex-1 rounded-xl border py-2 text-xs font-medium"
            style={{ borderColor: status === l.status ? l.color : 'var(--color-line)', color: status === l.status ? l.color : 'var(--color-ink-dim)' }}
          >
            {l.label}
          </button>
        ))}
      </div>
      <input
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
        placeholder="Link da partitura"
        className="rounded-xl border px-3 py-2.5 text-sm outline-none"
        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-line)' }}
      />
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={save}
        className="rounded-xl py-3 text-center font-medium"
        style={{ background: 'var(--gradient-brand)', color: 'var(--color-accent-ink)' }}
      >
        Salvar
      </motion.button>
      <button
        onClick={() => onDelete(piece.id)}
        className="flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm"
        style={{ borderColor: 'var(--color-warn)', color: 'var(--color-warn)' }}
      >
        <Trash2 size={14} /> Remover peça
      </button>
    </div>
  )
}
