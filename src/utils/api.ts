export class TokenExpiredError extends Error {
  constructor() {
    super('GitHubトークンの有効期限が切れています。')
  }
}

export const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    if (response.status === 401 && body?.code === 'TOKEN_EXPIRED') {
      throw new TokenExpiredError()
    }
    throw new Error(`データの取得に失敗しました (${response.status})`)
  }
  return (await response.json()) as T
}

export const getApiBaseUrl = (): string => {
  return ''
}
