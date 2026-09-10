import type { ReactNode } from 'react'
import { CircleOfFifths } from '../components/CircleOfFifths'
import { CADENCES, CHORD_FORMULAS, CLEF_LINES, FINGERING_C_MAJOR, INTERVALS } from '../lib/theory'

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border p-4" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-line)' }}>
      <h2 className="font-display text-base font-semibold">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-xs" style={{ color: 'var(--color-ink-dim)' }}>
          {subtitle}
        </p>
      )}
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function TheoryTab() {
  return (
    <div className="flex flex-col gap-4 pb-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-balance">Teoria essencial</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-ink-dim)' }}>
          Referência rápida para consultar enquanto estuda.
        </p>
      </header>

      <Section title="Lendo a pauta dupla" subtitle="Sol (mão direita) e Fá (mão esquerda) se encontram no Dó central.">
        <div className="flex flex-col gap-2">
          {CLEF_LINES.map((c) => (
            <div key={c.clef} className="rounded-xl px-3 py-2" style={{ background: 'var(--color-surface-2)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--color-ink-dim)' }}>
                {c.clef}
              </p>
              <p className="mt-0.5 font-mono text-sm">Linhas: {c.lines}</p>
              <p className="font-mono text-sm">Espaços: {c.spaces}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Intervalos" subtitle="Semitons a partir do Dó.">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {INTERVALS.map((iv) => (
            <div key={iv.name} className="rounded-xl px-3 py-2" style={{ background: 'var(--color-surface-2)' }}>
              <p className="text-xs font-medium">{iv.name}</p>
              <p className="font-mono text-[11px]" style={{ color: 'var(--color-ink-dim)' }}>
                {iv.semitones}st · {iv.example}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Fórmulas de acordes" subtitle='1 = fundamental; "b" abaixa meio tom, "#" sobe.'>
        <div className="grid grid-cols-2 gap-1.5">
          {CHORD_FORMULAS.map((c) => (
            <div key={c.name} className="rounded-xl px-3 py-2" style={{ background: 'var(--color-surface-2)' }}>
              <p className="text-xs font-medium">{c.name}</p>
              <p className="font-mono text-[11px]" style={{ color: 'var(--color-accent)' }}>
                {c.formula}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Cadências mais comuns">
        <ul className="flex flex-col gap-2.5">
          {CADENCES.map((c) => (
            <li key={c.label} className="flex gap-3 text-sm">
              <span className="w-16 shrink-0 font-mono text-xs font-bold" style={{ color: 'var(--color-accent)' }}>
                {c.name}
              </span>
              <span>
                <b className="font-medium">{c.label}</b> — {c.desc}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Círculo das quintas" subtitle="Anel externo: maiores. Anel interno: relativas menores.">
        <CircleOfFifths />
      </Section>

      <Section title="Dedilhado — escala de Dó Maior">
        <div className="flex flex-col gap-1.5 font-mono text-sm">
          <p>Mão direita: {FINGERING_C_MAJOR.right}</p>
          <p>Mão esquerda: {FINGERING_C_MAJOR.left}</p>
        </div>
        <p className="mt-2 text-xs" style={{ color: 'var(--color-ink-dim)' }}>
          O polegar (1) "passa por baixo" da mão para manter o movimento contínuo — é o ponto que mais trava iniciantes.
        </p>
      </Section>
    </div>
  )
}
