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

  return <TestDetail testId={testId} env={env} />
}
