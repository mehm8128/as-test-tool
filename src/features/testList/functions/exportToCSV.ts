import type { TestResult } from '../../../states/results'
import type { Setting } from '../../../states/setting'

export const exportToCsv = (results: TestResult[], setting: Setting) => {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    getHeader() +
    results.map((result) => resultToCsvRow(result, setting)).join('\n')
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
  const procedureAndExpectedResults = Array(10)
    .fill(null)
    .map((_, index) => [
      `期待される結果 ${index + 1}. に対する操作内容`,
      `得られた結果 ${index + 1}.`,
      `期待される結果 ${index + 1}. を満たしているか`
    ])

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
    ...procedureAndExpectedResults.flat(),
    '備考'
  ].join(',')}\n`
}

export const resultToCsvRow = (test: TestResult, setting: Setting): string => {
  const procedureAndExpectedResults = Array(10)
    .fill(null)
    .map((_, index) => {
      const operationAndResult = test.operationAndResults[index]
      if (!operationAndResult) {
        return ['', '', '']
      }
      return [
        operationAndResult.operation,
        operationAndResult.result,
        operationAndResult.isSatisfied === undefined
          ? ''
          : operationAndResult.isSatisfied
            ? '満たしている'
            : '満たしていない'
      ]
    })
    .flat()

  return [
    test.date,
    setting.name,
    setting.email,
    setting.os,
    setting.browser,
    setting.at,
    setting.atSetting,
    `'${test.testId}`,
    test.env === 'sight' ? '視覚閲覧環境' : '音声閲覧環境',
    ...procedureAndExpectedResults
  ]
    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
    .join(',')
}
