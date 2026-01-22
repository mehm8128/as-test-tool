import { Link } from '@tanstack/react-router'
import { atom, useAtomValue } from 'jotai'
import { atomFamily } from 'jotai-family'
import { useState } from 'react'

export interface TestDetail {
	filename: string
	title: string
	procedure: string
	expectedResult: string
	notes: string
	link: string
	env?: string
}

const testTitleAtomFamily = atomFamily((key: string) =>
	atom(async () => {
		// keyから filename と env を分離
		const [filename, env] = key.split('|')
		let url = `http://localhost:3001/api/tests/${filename}`
		if (env) {
			url += `?env=${env}`
		}
		const response = await fetch(url)
		return (await response.json()) as TestDetail
	})
)

export function TestDetail({
	filename,
	env
}: {
	filename: string
	env?: string
}) {
	const atomKey = env ? `${filename}|${env}` : filename
	const testData = useAtomValue(testTitleAtomFamily(atomKey))

	const [operation, setOperation] = useState('')
	const [result, setResult] = useState('')

	return (
		<div>
			<Link to="/">← Back</Link>
			<h1>{testData.filename}</h1>
			<div>
				<h2>タイトル</h2>
				<p>{testData.title}</p>
				<h2>テスト方法</h2>
				<h3>手順</h3>
				<p>{testData.procedure}</p>
				<h3>注意事項</h3>
				<p>{testData.notes}</p>
				<label>
					<span>行った操作</span>
					<textarea
						value={operation}
						onChange={e => setOperation(e.target.value)}
					/>
				</label>
				<h2>期待される結果</h2>
				<p>{testData.expectedResult}</p>
				<label>
					<span>操作の結果</span>
					<textarea value={result} onChange={e => setResult(e.target.value)} />
				</label>
				<h2>リンク</h2>
				<p>
					<a href={testData.link} target="_blank" rel="noopener noreferrer">
						{testData.link}
					</a>
				</p>
			</div>
		</div>
	)
}
