import { AnimatePresence, motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85vh] w-full max-w-[480px] overflow-y-auto rounded-t-3xl border-t px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-4"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          >
            <div className="mx-auto mb-3 h-1 w-9 rounded-full" style={{ background: 'var(--color-line)' }} />
            <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
