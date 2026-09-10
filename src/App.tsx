import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { BottomNav, type TabId } from './components/BottomNav'
import { useLocalStorage } from './lib/storage'
import { HomeTab } from './tabs/HomeTab'
import { RepertoireTab } from './tabs/RepertoireTab'
import { TheoryTab } from './tabs/TheoryTab'
import { MaestroTab } from './tabs/MaestroTab'

export default function App() {
  const [tab, setTab] = useState<TabId>('hoje')
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('etude:theme', 'dark')

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme
  }

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[480px] px-5 pt-14" style={{ background: 'var(--color-bg)' }}>
      <div className="pointer-events-none fixed top-4 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 px-5">
        <div className="flex justify-end">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border"
            style={{ borderColor: 'var(--color-line)', color: 'var(--color-ink-dim)', background: 'var(--color-surface)' }}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.main
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
          className="pb-28"
        >
          {tab === 'hoje' && <HomeTab />}
          {tab === 'repertorio' && <RepertoireTab />}
          {tab === 'teoria' && <TheoryTab />}
          {tab === 'maestro' && <MaestroTab />}
        </motion.main>
      </AnimatePresence>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}
