import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center gap-4 px-6 text-center">
          <h1 className="font-display text-xl font-semibold">Algo deu errado</h1>
          <p className="text-sm" style={{ color: 'var(--color-ink-dim)' }}>
            A página travou ao carregar. Isso às vezes acontece quando um dado salvo fica corrompido — tente
            recarregar; se continuar, um backup importado incorretamente pode ser a causa.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl px-5 py-2.5 font-medium"
            style={{ background: 'var(--gradient-brand)', color: 'var(--color-accent-ink)' }}
          >
            Recarregar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
