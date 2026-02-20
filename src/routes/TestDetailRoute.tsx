import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { TestDetail } from '../features/testDetail/TestDetail'
import type { TestEnv } from '../states/testDetail'

export function TestDetailRoute() {
  const { testId } = useParams()
  const [searchParams] = useSearchParams()
  const env: TestEnv = searchParams.get('env') === 'sound' ? 'sound' : 'sight'

  if (!testId) {
    return <Navigate to="/" replace />
  }

  return <TestDetail testId={testId} env={env} key={[testId, env].join()} />
}
