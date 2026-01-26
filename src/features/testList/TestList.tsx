import { atom, useAtomValue } from 'jotai'
import { getApiBaseUrl } from '../../utils/api'
import { toCsv } from '../csv/functions/toCSV'
import { settingAtom, testResultsAtom } from '../csv/state'
import { TestListItem } from './TestListItem'

export const testsAtom = atom(async () => {
  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}/api`)
  const data = await response.json()
  return data.tests as string[]
})

export function TestList() {
  const tests = useAtomValue(testsAtom)
  const testResults = useAtomValue(testResultsAtom)
  const setting = useAtomValue(settingAtom)

  const handleExportToCsv = () => {
    toCsv(testResults, setting)
  }

  const handleResetResults = () => {
    if (confirm('本当に結果をリセットしますか？')) {
      //TODO: リセット
    }
  }

  return (
    <div>
      <h1>AS Test Tool</h1>
      <p>
        ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明
      </p>
      <div>
        <button onClick={handleExportToCsv} type="button">
          CSVにエクスポート
        </button>
        <button onClick={handleResetResults} type="button">
          結果をリセット
        </button>
      </div>
      <div>
        <ul>
          {tests.map((test: string) => {
            return <TestListItem key={test} test={test} />
          })}
        </ul>
      </div>
    </div>
  )
}
