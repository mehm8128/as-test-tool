export const extractTestTitle = (content: string): string => {
	const titleMatch = content.match(/^#\s*テストのタイトル\s*\n\n(.*)$/m)
	return titleMatch ? titleMatch[1].trim() : 'Untitled'
}

export const extractTestProcedure = (content: string): string => {
	const procedureMatch = content.match(
		/^#\s*テスト手順 \(視覚閲覧環境\)\s*\n\n([\s\S]*?)\n#\s*/m
	)
	return procedureMatch ? procedureMatch[1].trim() : 'No procedure found'
}

export const extractTestExpectedResult = (content: string): string => {
	const expectedResultMatch = content.match(
		/^#\s*期待される結果 \(視覚閲覧環境\)\s*\n\n([\s\S]*?)\n#\s*/m
	)
	return expectedResultMatch
		? expectedResultMatch[1].trim()
		: 'No expected result found'
}

export const extractTestNotes = (content: string): string => {
	const notesMatch = content.match(
		/^#\s*テスト実施時の注意点 \(視覚閲覧環境\)\s*\n\n([\s\S]*?)\n#\s*/m
	)
	return notesMatch ? notesMatch[1].trim() : 'No notes found'
}

export const generateTestLink = (filename: string): string => {
	return `https://waic.github.io/as_test/WAIC-TEST/HTML/${filename}.html`
}
