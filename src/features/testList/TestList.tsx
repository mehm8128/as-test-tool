import { useAtomValue, useSetAtom } from 'jotai'
import { TestListItem } from './TestListItem'
import { testsAtom } from '../../states/testList'
import styles from './TestList.module.css'
import { InputText } from '../../components/InputText/InputText'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/Button/Button'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import { testResultsAtom, resetTestResultsAtom } from '../../states/results'
import { settingAtom } from '../../states/setting'
import { exportToCsv } from './functions/exportToCSV'

export function TestList() {
  const tests = useAtomValue(testsAtom)
  const testResults = useAtomValue(testResultsAtom)
  const setting = useAtomValue(settingAtom)
  const resetTestResults = useSetAtom(resetTestResultsAtom)

  const [searchValue, setSearchValue] = useState('')

  const filteredTests = tests.filter((testId) => {
    if (!searchValue) {
      return true
    }
    const lowerSearchValue = searchValue.toLowerCase()
    return testId.toLowerCase().includes(lowerSearchValue) // TODO: テストタイトルも検索対象に含める
  })

  const handleExportToCsv = () => {
    exportToCsv(testResults, setting)
  }

  const handleResetResults = () => {
    if (confirm('本当に全てのテスト結果をリセットしますか？')) {
      resetTestResults()
    }
  }

  return (
    <div className={styles.module}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>AS Test Tool</h1>
        </div>
        <div className={styles.buttons}>
          <div className={styles.innerButtons}>
            <LinkButton to="/setting">各種設定</LinkButton>
            <Button onClick={handleExportToCsv}>CSVにエクスポート</Button>
          </div>
          <Button onClick={handleResetResults}>結果をリセット</Button>
        </div>
      </div>
      <div className={styles.listWithSearch}>
        <label className={styles.searchContainer}>
          <span>テストID・タイトルで検索</span>
          <span className={styles.search}>
            <Search />
            <InputText
              type="search"
              full
              value={searchValue}
              onChange={(value) => setSearchValue(value)}
            />
          </span>
        </label>
        {filteredTests.length > 0 ? (
          <ul className={styles.ul}>
            {filteredTests.map((testId: string) => {
              return <TestListItem key={testId} testId={testId} />
            })}
          </ul>
        ) : (
          <div>該当するテストが見つかりません。</div>
        )}
      </div>
    </div>
  )
}
