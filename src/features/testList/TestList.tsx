import { useAtomValue, useSetAtom } from 'jotai'
import { TestListItem } from './TestListItem'
import { testsAtom } from '../../states/testList'
import styles from './TestList.module.css'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/Button/Button'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import { testResultsAtom, resetTestResultsAtom } from '../../states/results'
import { settingAtom } from '../../states/setting'
import { exportToCsv } from './functions/exportToCSV'
import type { TestListItem as TestListItemType } from '../../states/testList'
import { ExternalAnchorLink } from '../../components/AnchorLink/AnchorLink'

export function TestList() {
  const tests = useAtomValue(testsAtom)
  const testResults = useAtomValue(testResultsAtom)
  const setting = useAtomValue(settingAtom)
  const resetTestResults = useSetAtom(resetTestResultsAtom)

  const [searchValue, setSearchValue] = useState('')

  const filteredTests = tests.filter((test) => {
    if (!searchValue) {
      return true
    }
    const lowerSearchValue = searchValue.toLowerCase()
    return (
      test.testId.toLowerCase().includes(lowerSearchValue) ||
      test.title.toLowerCase().includes(lowerSearchValue)
    )
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
        <p>
          ASテストを実行するためのツールです。
          <br />
          各種設定含め、入力したデータはローカルストレージのみに保存され、サーバーには保存されません。
          <br />
          各テストケースの全ての期待される結果に対して、満たしているかどうかの判定が完了している場合のみ、CSVエクスポートされます。
          <br />
          テストケースは全て、
          <ExternalAnchorLink href="https://github.com/waic/as_test">
            WAICで管理されているもの
          </ExternalAnchorLink>
          です。
        </p>
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
            <Search className={styles.searchIcon} />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
            />
          </span>
        </label>
        {filteredTests.length > 0 ? (
          <ul className={styles.ul}>
            {filteredTests.map((test: TestListItemType) => {
              return <TestListItem key={test.testId} testId={test.testId} testTitle={test.title} />
            })}
          </ul>
        ) : (
          <div>該当するテストが見つかりません。</div>
        )}
      </div>
    </div>
  )
}
