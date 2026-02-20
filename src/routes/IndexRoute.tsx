import { TestList } from '../features/testList/TestList'
import { useTitle } from '../hooks/useTitle'

export function IndexRoute() {
  useTitle('テスト一覧 - AS Test Tool')

  return <TestList />
}
