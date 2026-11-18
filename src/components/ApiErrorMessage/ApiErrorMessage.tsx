import { TokenExpiredError } from '../../utils/api'

interface Props {
  error: Error
}

export function ApiErrorMessage({ error }: Props) {
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
