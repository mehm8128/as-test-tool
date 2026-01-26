import { useAtomValue, useSetAtom } from 'jotai'
import { exportToCsv } from './functions/exportToCSV'
import { resetTestResultsAtom, testResultsAtom } from '../../states/results'
import { TestListItem } from './TestListItem'
import { settingAtom } from '../../states/setting'
import { testsAtom } from '../../states/testList'
import { Button } from '../../components/Button/Button'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import styles from './TestList.module.css'

export function TestList() {
  const tests = useAtomValue(testsAtom)
  const testResults = useAtomValue(testResultsAtom)
  const setting = useAtomValue(settingAtom)
  const resetTestResults = useSetAtom(resetTestResultsAtom)

  const handleExportToCsv = () => {
    exportToCsv(testResults, setting)
  }

  const handleResetResults = () => {
    if (confirm('本当に全てのテスト結果をリセットしますか？')) {
      resetTestResults()
    }
  }

  return (
    <div>
      <h1>AS Test Tool</h1>
      <p>
        ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明ちょっとした説明
      </p>
      <div className={styles.buttons}>
        <div className={styles.innerButtons}>
          <LinkButton to="/setting">各種設定</LinkButton>
          <Button onClick={handleExportToCsv}>CSVにエクスポート</Button>
        </div>
        <Button onClick={handleResetResults}>結果をリセット</Button>
      </div>
      <div>
        <ul>
          {tests.map((testId: string) => {
            return <TestListItem key={testId} testId={testId} />
          })}
        </ul>
      </div>
    </div>
  )
}
