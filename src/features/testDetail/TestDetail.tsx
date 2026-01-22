import { Link } from '@tanstack/react-router'
import { atom, useAtomValue } from 'jotai'
import { atomFamily } from 'jotai-family'

export interface TestDetail {
	filename: string
	title: string
}

const testTitleAtomFamily = atomFamily((filename: string) =>
	atom(async () => {
		const response = await fetch(`/api/tests/${filename}`)
		return (await response.json()) as TestDetail
	})
)

export function TestDetail({ filename }: { filename: string }) {
	const testData = useAtomValue(testTitleAtomFamily(filename))

	return (
		<div>
			<Link to="/">← Back</Link>
			<h1>{testData.filename}</h1>
			<div>
				<h2>テストのタイトル:</h2>
				<p>{testData.title}</p>
			</div>
		</div>
	)
}
