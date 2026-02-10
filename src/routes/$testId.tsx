import { createFileRoute } from '@tanstack/react-router'
import { TestDetail } from '../features/testDetail/TestDetail'
import type { TestEnv } from '../states/testDetail'

export const Route = createFileRoute('/$testId')({
  component: TestDetailRoute,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      env: (search.env as TestEnv) ?? 'sight'
    }
  }
})

function TestDetailRoute() {
  const { testId } = Route.useParams()
  const { env } = Route.useSearch()

  // testIdやenvが変わったときに状態が初期化されないことがあるため、keyを明示的に指定して再レンダリングしている
  return <TestDetail testId={testId} env={env} key={[testId, env].join()} />
}
