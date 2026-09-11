import { useState } from 'react'
import { motion, MotionConfig } from 'framer-motion'
import { DatabaseBackup, Moon, Sun } from 'lucide-react'
import { BackupSheet } from './components/BackupSheet'
import { BottomNav, type TabId } from './components/BottomNav'
import { useLocalStorage } from './lib/storage'
import { HomeTab } from './tabs/HomeTab'
import { RepertoireTab } from './tabs/RepertoireTab'
import { TheoryTab } from './tabs/TheoryTab'
import { MaestroTab } from './tabs/MaestroTab'

export default function App() {
  const [tab, setTab] = useState<TabId>('hoje')
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('etude:theme', 'dark')
  const [backupOpen, setBackupOpen] = useState(false)

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative mx-auto min-h-dvh w-full max-w-[480px] px-5 pt-14" style={{ background: 'var(--color-bg)' }}>
        <div className="pointer-events-none fixed top-2 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 px-3">
          <div className="flex justify-end gap-1">
            <button
              onClick={() => setBackupOpen(true)}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full"
              style={{ color: 'var(--color-ink-dim)' }}
              aria-label="Backup dos dados"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border"
                style={{ borderColor: 'var(--color-line)', background: 'var(--color-surface)' }}
              >
                <DatabaseBackup size={14} />
              </span>
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full"
              style={{ color: 'var(--color-ink-dim)' }}
              aria-label="Alternar tema"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border"
                style={{ borderColor: 'var(--color-line)', background: 'var(--color-surface)' }}
              >
                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              </span>
            </button>
          </div>
        </div>

        <motion.main
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16 }}
          className="pb-28"
        >
          {tab === 'hoje' && <HomeTab />}
          {tab === 'repertorio' && <RepertoireTab />}
          {tab === 'teoria' && <TheoryTab />}
          {tab === 'maestro' && <MaestroTab />}
        </motion.main>

        <BottomNav active={tab} onChange={setTab} />
        <BackupSheet open={backupOpen} onClose={() => setBackupOpen(false)} />
      </div>
    </MotionConfig>
  )
}
