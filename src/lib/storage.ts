import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or unavailable — fail silently, data just won't persist
    }
  }, [key, value])

  return [value, setValue] as const
}

export type PieceStatus = 'a-aprender' | 'aprendendo' | 'dominada'

export interface Piece {
  id: string
  title: string
  composer: string
  status: PieceStatus
  sourceUrl: string
  addedAt: string
}

export interface PracticeSession {
  id: string
  date: string // YYYY-MM-DD
  durationSec: number
  note: string
  focus: string[]
}

export interface Exercise {
  id: string
  name: string
  target: string
  history: string[] // ISO dates practiced
}

export interface Goal {
  id: string
  text: string
  done: boolean
}

export function sourceLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function daysAgoISO(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export const DEFAULT_EXERCISES: Exercise[] = [
  { id: 'ex1', name: 'Escala de Dó Maior — 2 mãos, 2 oitavas', target: 'diária', history: [] },
  { id: 'ex2', name: 'Escala de Sol Maior — 2 mãos, 2 oitavas', target: 'diária', history: [] },
  { id: 'ex3', name: 'Hanon nº 1', target: 'diária', history: [] },
  { id: 'ex4', name: 'Arpejos de tríade (Dó, Sol, Fá)', target: '3x/semana', history: [] },
  { id: 'ex5', name: 'Leitura à primeira vista (5 min)', target: 'diária', history: [] },
]
