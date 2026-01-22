import { Link } from '@tanstack/react-router'
import { atom, useAtomValue } from 'jotai'

const testsAtom = atom(async () => {
	const response = await fetch('/api/tests')
	const data = await response.json()
	return data.tests as string[]
})

export function TestList() {
	const tests = useAtomValue(testsAtom)

	return (
		<div>
			<h1>WAIC Test 一覧</h1>
			<ul>
				{tests.map((test: string) => {
					const filename = test.replace(/\.md$/, '')
					return (
						<li key={test}>
							<Link to="/$filename" params={{ filename }}>
								{test}
							</Link>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
