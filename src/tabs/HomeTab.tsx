import { useEffect, useRef, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Check, Play, Plus, Square, Trash2, X } from 'lucide-react'
import { BottomSheet } from '../components/BottomSheet'
import { computeStreak, weekCount, weekSeconds } from '../lib/streak'
import {
  DEFAULT_EXERCISES,
  todayISO,
  uid,
  useLocalStorage,
  type Exercise,
  type Goal,
  type PracticeSession,
} from '../lib/storage'

const FOCUS_OPTIONS = ['Técnica', 'Leitura', 'Repertório', 'Teoria', 'Ritmo']

function formatElapsed(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function HomeTab() {
  const [sessions, setSessions] = useLocalStorage<PracticeSession[]>('etude:practice', [])
  const [exercises, setExercises] = useLocalStorage<Exercise[]>('etude:exercises', DEFAULT_EXERCISES)
  const [goals, setGoals] = useLocalStorage<Goal[]>('etude:goals', [])

  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [note, setNote] = useState('')
  const [focus, setFocus] = useState<string[]>([])
  const [goalText, setGoalText] = useState('')
  const [exerciseText, setExerciseText] = useState('')
  const startedAt = useRef<number | null>(null)
  const pendingDuration = useRef(0)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      if (startedAt.current) setElapsed(Math.floor((Date.now() - startedAt.current) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  function startTimer() {
    startedAt.current = Date.now()
    setElapsed(0)
    setRunning(true)
  }

  function finishTimer() {
    pendingDuration.current = elapsed
    setRunning(false)
    startedAt.current = null
    setSheetOpen(true)
  }

  function saveSession() {
    const session: PracticeSession = {
      id: uid(),
      date: todayISO(),
      durationSec: pendingDuration.current,
      note: note.trim(),
      focus,
    }
    setSessions((prev) => [session, ...prev])
    setSheetOpen(false)
    setNote('')
    setFocus([])
    setElapsed(0)
  }

  function toggleExercise(id: string) {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== id) return ex
        const t = todayISO()
        const has = ex.history.includes(t)
        return { ...ex, history: has ? ex.history.filter((d) => d !== t) : [...ex.history, t] }
      }),
    )
  }

  function addExercise(e: FormEvent) {
    e.preventDefault()
    if (!exerciseText.trim()) return
    setExercises((prev) => [...prev, { id: uid(), name: exerciseText.trim(), target: 'diária', history: [] }])
    setExerciseText('')
  }

  function removeExercise(id: string) {
    setExercises((prev) => prev.filter((e) => e.id !== id))
  }

  function addGoal(e: FormEvent) {
    e.preventDefault()
    if (!goalText.trim()) return
    setGoals((prev) => [...prev, { id: uid(), text: goalText.trim(), done: false }])
    setGoalText('')
  }

  function toggleGoal(id: string) {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g)))
  }

  function removeGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  const streak = computeStreak(sessions)
  const weekMin = Math.round(weekSeconds(sessions) / 60)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

  return (
    <div className="flex flex-col gap-6 pb-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-balance">{greeting}. Hora de praticar?</h1>
        <div className="mt-3 flex gap-3">
          <StatPill value={streak} label={streak === 1 ? 'dia seguido' : 'dias seguidos'} accent />
          <StatPill value={weekMin} label="min esta semana" />
        </div>
      </header>

      {/* Timer */}
      <div
        className="flex flex-col items-center gap-4 rounded-3xl border py-8"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}
      >
        <div className="font-mono text-5xl font-medium tabular-nums" style={{ color: running ? 'var(--color-accent)' : 'var(--color-ink)' }}>
          {formatElapsed(elapsed)}
        </div>
        {!running ? (
          <button
            onClick={startTimer}
            className="flex items-center gap-2 rounded-full px-6 py-3 font-medium"
            style={{ background: 'var(--gradient-brand)', color: 'var(--color-accent-ink)' }}
          >
            <Play size={18} fill="currentColor" /> Começar a praticar
          </button>
        ) : (
          <button
            onClick={finishTimer}
            className="flex items-center gap-2 rounded-full border px-6 py-3 font-medium"
            style={{ borderColor: 'var(--color-line)' }}
          >
            <Square size={16} fill="currentColor" /> Concluir sessão
          </button>
        )}
      </div>

      {/* Exercises */}
      <section>
        <h2 className="mb-2 font-display text-sm font-semibold text-[var(--color-ink-dim)] uppercase tracking-wide">Exercícios de hoje</h2>
        <form onSubmit={addExercise} className="mb-2 flex gap-2">
          <input
            value={exerciseText}
            onChange={(e) => setExerciseText(e.target.value)}
            placeholder="Ex.: Escalas de Ré Maior"
            className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}
          />
          <button
            type="submit"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
            style={{ borderColor: 'var(--color-line)' }}
            aria-label="Adicionar exercício"
          >
            <Plus size={17} />
          </button>
        </form>
        <ul className="flex flex-col gap-1.5">
          {exercises.map((ex) => {
            const done = ex.history.includes(todayISO())
            return (
              <li
                key={ex.id}
                className="flex items-center gap-1 rounded-2xl border pr-1 pl-1"
                style={{ background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}
              >
                <button
                  onClick={() => toggleExercise(ex.id)}
                  aria-pressed={done}
                  aria-label={`Marcar ${ex.name} como praticado hoje`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center"
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full border transition-colors"
                    style={{
                      borderColor: done ? 'var(--color-good)' : 'var(--color-line)',
                      background: done ? 'var(--color-good)' : 'transparent',
                      color: done ? 'var(--color-good-ink)' : 'transparent',
                    }}
                  >
                    <Check size={15} strokeWidth={3} />
                  </span>
                </button>
                <div className="min-w-0 flex-1 py-1">
                  <p className="truncate text-sm font-medium">{ex.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-ink-dim)' }}>
                    meta {ex.target} · <span className="font-mono">{weekCount(ex.history)}x</span> essa semana
                  </p>
                </div>
                <button
                  onClick={() => removeExercise(ex.id)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center"
                  style={{ color: 'var(--color-warn)' }}
                  aria-label="Remover exercício"
                >
                  <X size={15} />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Goals */}
      <section>
        <h2 className="mb-2 font-display text-sm font-semibold text-[var(--color-ink-dim)] uppercase tracking-wide">Metas</h2>
        <form onSubmit={addGoal} className="mb-2 flex gap-2">
          <input
            value={goalText}
            onChange={(e) => setGoalText(e.target.value)}
            placeholder="Ex.: tocar Für Elise inteira sem parar"
            className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}
          />
          <button
            type="submit"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
            style={{ borderColor: 'var(--color-line)' }}
            aria-label="Adicionar meta"
          >
            <Plus size={17} />
          </button>
        </form>
        {goals.length === 0 ? (
          <p className="rounded-xl border border-dashed px-3 py-3 text-xs" style={{ borderColor: 'var(--color-line)', color: 'var(--color-ink-dim)' }}>
            Nenhuma meta ainda.
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {goals.map((g) => (
              <li key={g.id} className="flex items-center gap-1">
                <button
                  onClick={() => toggleGoal(g.id)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center"
                  aria-pressed={g.done}
                  aria-label={`Marcar meta "${g.text}" como concluída`}
                >
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full border"
                    style={{ borderColor: g.done ? 'var(--color-good)' : 'var(--color-line)', background: g.done ? 'var(--color-good)' : 'transparent' }}
                  >
                    {g.done && <Check size={12} strokeWidth={3} color="var(--color-good-ink)" />}
                  </span>
                </button>
                <span className="flex-1 text-sm" style={{ color: g.done ? 'var(--color-ink-dim)' : 'var(--color-ink)', textDecoration: g.done ? 'line-through' : 'none' }}>
                  {g.text}
                </span>
                <button
                  onClick={() => removeGoal(g.id)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center"
                  style={{ color: 'var(--color-ink-dim)' }}
                  aria-label="Remover meta"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <BottomSheet open={sheetOpen} onClose={saveSession} dismissible={false} title={`Você praticou ${formatElapsed(pendingDuration.current)}`}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((f) => {
              const active = focus.includes(f)
              return (
                <button
                  key={f}
                  onClick={() => setFocus((prev) => (active ? prev.filter((x) => x !== f) : [...prev, f]))}
                  className="rounded-full border px-3 py-1.5 text-xs font-medium"
                  style={{
                    borderColor: active ? 'var(--color-accent)' : 'var(--color-line)',
                    color: active ? 'var(--color-accent)' : 'var(--color-ink-dim)',
                  }}
                >
                  {f}
                </button>
              )
            })}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="O que você praticou? (opcional)"
            className="min-h-20 rounded-xl border px-3 py-2 text-sm outline-none"
            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-line)' }}
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={saveSession}
            className="rounded-xl py-3 text-center font-medium"
            style={{ background: 'var(--gradient-brand)', color: 'var(--color-accent-ink)' }}
          >
            Salvar sessão
          </motion.button>
        </div>
      </BottomSheet>
    </div>
  )
}

function StatPill({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5 rounded-full border px-3.5 py-1.5" style={{ borderColor: 'var(--color-line)' }}>
      <span className="font-mono text-base font-bold tabular-nums" style={{ color: accent ? 'var(--color-accent)' : 'var(--color-ink)' }}>
        {value}
      </span>
      <span className="text-xs" style={{ color: 'var(--color-ink-dim)' }}>
        {label}
      </span>
    </div>
  )
}
