import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Send, Settings } from 'lucide-react'
import { askMentor, ClaudeApiError, type ChatMessage } from '../lib/claude'
import { useLocalStorage } from '../lib/storage'

const SUGGESTIONS = [
  'Como leio a clave de Fá sem travar?',
  'Como monto o acorde de Sol maior e sua inversão?',
  'Onde encontro uma partitura fácil e legal do Für Elise?',
  'Como uso o metrônomo para praticar escalas devagar?',
]

export function MaestroTab() {
  const [apiKey, setApiKey] = useLocalStorage<string>('etude:apiKey', '')
  const [turns, setTurns] = useLocalStorage<ChatMessage[]>('etude:chat', [])
  const [draftKey, setDraftKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const logRef = useRef<HTMLDivElement>(null)

  function scrollToBottom() {
    requestAnimationFrame(() => {
      logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
    })
  }

  async function send(text: string) {
    if (!text.trim() || loading) return
    setError('')
    const next = [...turns, { role: 'user', content: text.trim() } as ChatMessage]
    setTurns(next)
    setInput('')
    scrollToBottom()
    setLoading(true)
    try {
      const reply = await askMentor(apiKey, next.slice(-16))
      setTurns([...next, { role: 'assistant', content: reply }])
      scrollToBottom()
    } catch (e) {
      setError(e instanceof ClaudeApiError ? e.message : 'Não consegui responder agora — tente de novo.')
    } finally {
      setLoading(false)
    }
  }

  if (!apiKey || showSettings) {
    return (
      <div className="flex flex-col gap-4 pb-6">
        <header>
          <h1 className="font-display text-2xl font-semibold text-balance">Maestro</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-ink-dim)' }}>
            Um mentor de piano para tirar dúvidas de teoria, técnica e partituras.
          </p>
        </header>
        <div className="rounded-2xl border p-4" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}>
          <p className="text-sm">
            O Maestro usa a API da Anthropic diretamente do seu navegador — sua chave fica salva só neste
            aparelho e cada pergunta é cobrada na sua própria conta.
          </p>
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: 'var(--color-accent)' }}
          >
            Gerar uma chave em console.anthropic.com <ExternalLink size={13} />
          </a>
          <div className="mt-4 flex gap-2">
            <input
              type="password"
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              placeholder="sk-ant-..."
              className="flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-line)' }}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (!draftKey.trim()) return
              setApiKey(draftKey.trim())
              setDraftKey('')
              setShowSettings(false)
            }}
            className="mt-3 w-full rounded-xl py-3 text-center font-medium"
            style={{ background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}
          >
            Salvar chave
          </motion.button>
          {apiKey && (
            <button
              onClick={() => setShowSettings(false)}
              className="mt-3 w-full rounded-xl border py-2.5 text-center text-sm"
              style={{ borderColor: 'var(--color-line)', color: 'var(--color-ink-dim)' }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100dvh-9.5rem)] flex-col pb-2">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold">Maestro</h1>
        </div>
        <button onClick={() => setShowSettings(true)} aria-label="Configurações" style={{ color: 'var(--color-ink-faint)' }}>
          <Settings size={19} />
        </button>
      </header>

      <div ref={logRef} className="flex-1 space-y-3 overflow-y-auto pr-0.5">
        {turns.length === 0 && (
          <div className="rounded-2xl border p-3 text-sm" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}>
            Oi! Pode perguntar sobre teoria, técnica ou onde achar a partitura de uma peça.
          </div>
        )}
        {turns.map((t, i) => (
          <div
            key={i}
            className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap"
            style={
              t.role === 'user'
                ? { marginLeft: 'auto', background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }
                : { background: 'var(--color-surface)', border: '1px solid var(--color-line)' }
            }
          >
            {t.content}
          </div>
        ))}
        {loading && (
          <div className="flex gap-1 rounded-2xl border px-3.5 py-3" style={{ borderColor: 'var(--color-line)', width: 'fit-content' }}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--color-ink-faint)' }}
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
        {error && (
          <div className="rounded-xl border px-3 py-2 text-xs" style={{ borderColor: 'var(--color-warn)', color: 'var(--color-warn)' }}>
            {error}
          </div>
        )}
      </div>

      {turns.length === 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border px-3 py-1.5 text-xs"
              style={{ borderColor: 'var(--color-line)', color: 'var(--color-ink-dim)' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send(input)
            }
          }}
          placeholder="Pergunte algo..."
          rows={1}
          className="max-h-28 flex-1 resize-none rounded-2xl border px-3.5 py-2.5 text-sm outline-none"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full disabled:opacity-40"
          style={{ background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}
          aria-label="Enviar"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
