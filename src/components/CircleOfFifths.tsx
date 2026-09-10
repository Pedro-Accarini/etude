import { CIRCLE_MAJORS, CIRCLE_MINORS } from '../lib/theory'

const SIZE = 280
const CENTER = SIZE / 2
const R_OUTER = 112
const R_INNER = 74

export function CircleOfFifths() {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" role="img" aria-label="Círculo das quintas" className="mx-auto block max-w-[280px]">
      <circle cx={CENTER} cy={CENTER} r={R_OUTER} fill="none" stroke="var(--color-line)" />
      <circle cx={CENTER} cy={CENTER} r={R_INNER} fill="none" stroke="var(--color-line)" />
      {CIRCLE_MAJORS.map((major, i) => {
        const angle = ((-90 + i * 30) * Math.PI) / 180
        const xOuter = CENTER + R_OUTER * Math.cos(angle)
        const yOuter = CENTER + R_OUTER * Math.sin(angle)
        const xInner = CENTER + R_INNER * Math.cos(angle)
        const yInner = CENTER + R_INNER * Math.sin(angle)
        return (
          <g key={major}>
            <text x={xOuter} y={yOuter} fontSize="13" fontWeight={700} textAnchor="middle" dominantBaseline="middle" fill="var(--color-accent-2)" fontFamily="var(--font-mono)">
              {major}
            </text>
            <text x={xInner} y={yInner} fontSize="10.5" textAnchor="middle" dominantBaseline="middle" fill="var(--color-accent)" fontFamily="var(--font-mono)">
              {CIRCLE_MINORS[i]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
