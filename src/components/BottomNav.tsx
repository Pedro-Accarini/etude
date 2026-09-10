import { motion } from 'framer-motion'
import { Home, Library, Compass, MessagesSquare } from 'lucide-react'

export type TabId = 'hoje' | 'repertorio' | 'teoria' | 'maestro'

const TABS: { id: TabId; label: string; icon: typeof Home; color: string }[] = [
  { id: 'hoje', label: 'Hoje', icon: Home, color: 'var(--color-accent)' },
  { id: 'repertorio', label: 'Repertório', icon: Library, color: 'var(--color-accent-2)' },
  { id: 'teoria', label: 'Teoria', icon: Compass, color: 'var(--color-good)' },
  { id: 'maestro', label: 'Maestro', icon: MessagesSquare, color: 'var(--color-accent)' },
]

export function BottomNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 border-t px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
      style={{ background: 'color-mix(in srgb, var(--color-surface) 88%, transparent)', borderColor: 'var(--color-line)' }}
      aria-label="Navegação principal"
    >
      <ul className="flex items-stretch justify-between">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          const Icon = tab.icon
          return (
            <li key={tab.id} className="relative flex-1">
              <button
                onClick={() => onChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className="relative flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
                style={{ color: isActive ? tab.color : 'var(--color-ink-faint)' }}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute top-0.5 h-8 w-8 rounded-full"
                    style={{ background: 'color-mix(in srgb, ' + tab.color + ' 16%, var(--color-surface-2))' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon size={19} strokeWidth={isActive ? 2.3 : 1.8} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
