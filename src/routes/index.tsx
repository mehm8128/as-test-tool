import { createFileRoute } from '@tanstack/react-router'
import { TestList } from '../features/testList/TestList'

export const Route = createFileRoute('/')({ component: IndexRoute })

function IndexRoute() {
  return (
    <>
      <title>テスト一覧 - AS Test Tool</title>
      <TestList />
    </>
  )
}
