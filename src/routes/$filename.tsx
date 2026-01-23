import { createFileRoute } from '@tanstack/react-router'
import { TestDetail } from '../features/testDetail/TestDetail'

export const Route = createFileRoute('/$filename')({
  component: TestDetailRoute,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      env: (search.env as string) || undefined
    }
  }
})

function TestDetailRoute() {
  const { filename } = Route.useParams()
  const { env } = Route.useSearch()

  return <TestDetail filename={filename} env={env} />
}
