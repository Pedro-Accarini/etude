import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { sourceLabel, todayISO } from './storage'

describe('todayISO', () => {
  const originalTZ = process.env.TZ

  beforeEach(() => {
    process.env.TZ = 'America/Sao_Paulo'
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    process.env.TZ = originalTZ
  })

  it('usa a data local, não a data UTC, à noite (UTC-3)', () => {
    // 2026-09-11T01:00:00Z é 2026-09-10 22:00 em São Paulo — toISOString() sozinho
    // já teria "virado" o dia, contaminando sessão de prática, streak e exercícios.
    vi.setSystemTime(new Date('2026-09-11T01:00:00.000Z'))
    expect(todayISO()).toBe('2026-09-10')
  })
})

describe('sourceLabel', () => {
  it('extrai o domínio de uma URL com protocolo', () => {
    expect(sourceLabel('https://imslp.org/wiki/F%C3%BCr_Elise')).toBe('imslp.org')
  })

  it('remove o www. do domínio', () => {
    expect(sourceLabel('https://www.musescore.com/user/1')).toBe('musescore.com')
  })

  it('cai para a string original quando falta o protocolo (link colado sem https://)', () => {
    expect(sourceLabel('imslp.org/wiki/Foo')).toBe('imslp.org/wiki/Foo')
  })
})
