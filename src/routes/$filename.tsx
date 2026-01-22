import { createFileRoute } from '@tanstack/react-router'
import { TestDetail } from '../features/testDetail/TestDetail'

export const Route = createFileRoute('/$filename')({
	component: TestDetailRoute
})

function TestDetailRoute() {
	const { filename } = Route.useParams()

	return <TestDetail filename={filename} />
}
