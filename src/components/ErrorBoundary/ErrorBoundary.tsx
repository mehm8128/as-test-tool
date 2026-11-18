import { Component, type ReactNode } from 'react'
import { TokenExpiredError } from '../../utils/api'

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
    const { error } = this.state
    if (!error) {
      return this.props.children
    }
    return (
      <div>
        <p>
          {error instanceof TokenExpiredError
            ? 'GitHubトークンの有効期限が切れています。管理者にお問い合わせください。'
            : 'データの取得に失敗しました。時間をおいて再度お試しください。'}
        </p>
      </div>
    )
  }
}
