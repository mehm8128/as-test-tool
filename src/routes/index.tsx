import { createFileRoute } from '@tanstack/react-router'
import { TestList } from '../features/testList/TestList'
import { useTitle } from '../hooks/useTitle'

export const Route = createFileRoute('/')({ component: IndexRoute })

function IndexRoute() {
  useTitle('テスト一覧 - AS Test Tool')

  return <TestList />
}
