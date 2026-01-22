export type EnvType = 'sight' | 'sound'

export const extractTestTitle = (content: string): string => {
	const titleMatch = content.match(/^#\s*テストのタイトル\s*\n\n(.*)$/m)
	return titleMatch ? titleMatch[1].trim() : 'Untitled'
}

export const extractTestProcedure = (content: string, env: EnvType): string => {
	const procedureMatch =
		env === 'sight'
			? content.match(/^# テスト手順 \(視覚閲覧環境\)\s*\n\n([\s\S]*?)\n#\s*/m)
			: content.match(/^# テスト手順 \(音声閲覧環境\)\s*\n\n([\s\S]*?)\n#\s*/m)
	return procedureMatch ? procedureMatch[1].trim() : 'No procedure found'
}

export const extractTestExpectedResult = (
	content: string,
	env: EnvType
): string => {
	const expectedResultMatch =
		env === 'sight'
			? content.match(
					/^# 期待される結果 \(視覚閲覧環境\)\s*\n\n([\s\S]*?)\n#\s*/m
				)
			: content.match(
					/^# 期待される結果 \(音声閲覧環境\)\s*\n\n([\s\S]*?)\n#\s*/m
				)
	return expectedResultMatch
		? expectedResultMatch[1].trim()
		: 'No expected result found'
}

export const extractTestNotes = (content: string, env: EnvType): string => {
	const notesMatch =
		env === 'sight'
			? content.match(
					/^# テスト実施時の注意点 \(視覚閲覧環境\)\s*\n\n([\s\S]*?)\n#\s*/m
				)
			: content.match(
					/^# テスト実施時の注意点 \(音声閲覧環境\)\s*\n\n([\s\S]*?)\n#\s*/m
				)
	return notesMatch ? notesMatch[1].trim() : 'No notes found'
}

export const generateTestLink = (filename: string): string => {
	return `https://waic.github.io/as_test/WAIC-TEST/HTML/${filename}.html`
}
