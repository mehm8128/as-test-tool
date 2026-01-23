import type { Setting, TestResult } from '../schema'

export const toCsv = (results: TestResult[], setting: Setting) => {
	const csvContent =
		'data:text/csv;charset=utf-8,' +
		getHeader() +
		results // TODO: localstorageから取るようにする
			.map(result => resultToCsvRow(result, setting))
			.join('\n')
	const encodedUri = encodeURI(csvContent)
	const link = document.createElement('a')
	const currentDate = new Date().toLocaleString()
	link.setAttribute('href', encodedUri)
	link.setAttribute('download', `waic_as_test_result_${currentDate}.csv`)
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

const getHeader = (): string => {
	return `${[
		'テスト実施日',
		'氏名',
		'メールアドレス',
		'OS',
		'ブラウザ',
		'支援技術',
		'支援技術に対する追加の設定',
		'テストケース番号',
		'視覚閲覧環境、音声閲覧環境の種別',
		'期待される結果 1. に対する操作内容',
		'得られた結果 1.',
		'期待される結果 1. を満たしているか'
	].join(',')}\n`
}

const resultToCsvRow = (test: TestResult, setting: Setting): string => {
	return [
		test.date,
		setting.name,
		setting.email,
		setting.os,
		setting.browser,
		setting.at,
		setting.atSetting,
		test.testNum,
		test.env === 'sight' ? '視覚閲覧環境' : '音声閲覧環境',
		`"${test.operation.replace(/"/g, '""')}"`,
		`"${test.result.replace(/"/g, '""')}"`,
		test.isSatisfied ? '満たしている' : '満たしていない'
	].join(',')
}
