import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { computeStreak, weekCount } from './streak'
import type { PracticeSession } from './storage'

const TZ = 'America/Sao_Paulo'

// Meio-dia local evita qualquer ambiguidade de fuso na virada do dia.
function atLocalNoon(iso: string) {
  return new Date(`${iso}T15:00:00.000Z`)
}

function session(date: string): PracticeSession {
  return { id: date, date, durationSec: 60, note: '', focus: [] }
}

describe('computeStreak', () => {
  const originalTZ = process.env.TZ

  beforeEach(() => {
    process.env.TZ = TZ
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    process.env.TZ = originalTZ
  })

  it('conta o streak sem sessão hoje, se houve sessão ontem', () => {
    vi.setSystemTime(atLocalNoon('2026-09-11'))
    expect(computeStreak([session('2026-09-10')])).toBe(1)
  })

  it('zera quando não há sessão nem hoje nem ontem', () => {
    vi.setSystemTime(atLocalNoon('2026-09-11'))
    expect(computeStreak([session('2026-09-05')])).toBe(0)
  })

  it('para de contar no primeiro dia faltante, não trata dias não consecutivos como um streak só', () => {
    vi.setSystemTime(atLocalNoon('2026-09-11'))
    const sessions = [session('2026-09-11'), session('2026-09-10'), session('2026-09-08')] // falta 09-09
    expect(computeStreak(sessions)).toBe(2)
  })
})

describe('weekCount', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('conta uma janela rolante dos últimos 7 dias, não a semana de calendário', () => {
    process.env.TZ = TZ
    vi.useFakeTimers()
    vi.setSystemTime(atLocalNoon('2026-09-11'))
    // janela: 2026-09-05 .. 2026-09-11
    expect(weekCount(['2026-09-05'])).toBe(1)
    expect(weekCount(['2026-09-04'])).toBe(0)
  })
})
