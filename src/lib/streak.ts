import { daysAgoISO, todayISO, type PracticeSession } from './storage'

/** Consecutive days (ending today or yesterday) with at least one session. */
export function computeStreak(sessions: PracticeSession[]) {
  const dates = new Set(sessions.map((s) => s.date))
  let cursor = todayISO()
  if (!dates.has(cursor)) {
    cursor = daysAgoISO(1)
    if (!dates.has(cursor)) return 0
  }
  let streak = 0
  for (let i = 0; i < 400 && dates.has(cursor); i++) {
    streak++
    const d = new Date(cursor + 'T00:00:00')
    d.setDate(d.getDate() - 1)
    cursor = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }
  return streak
}

/** Total practice seconds in the rolling 7-day window ending today (not calendar week). */
export function weekSeconds(sessions: PracticeSession[]) {
  const since = daysAgoISO(6)
  return sessions.filter((s) => s.date >= since).reduce((sum, s) => sum + s.durationSec, 0)
}

/** Times an exercise's history falls within the rolling 7-day window ending today. */
export function weekCount(history: string[]) {
  const since = daysAgoISO(6)
  return history.filter((d) => d >= since).length
}
