import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback: (error: Error) => ReactNode
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
    const { error } = this.state
    if (!error) {
      return this.props.children
    }
    return this.props.fallback(error)
  }
}
