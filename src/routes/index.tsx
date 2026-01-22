import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { TestList } from '../features/testList/TestList'

export const Route = createFileRoute('/')({ component: IndexRoute })

function IndexRoute() {
	return (
		<Suspense fallback={<div>Loading tests...</div>}>
			<TestList />
		</Suspense>
	)
}
