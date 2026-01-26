import { Link } from '@tanstack/react-router'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { resetTestResultAtom, testResultsAtomFamily } from '../../states/results'
import { Circle, X } from 'lucide-react'
import { testDetailAtomFamily, type TestEnv } from '../../states/testDetail'
import { testsAtom } from '../../states/testList'
import { getTestKeyFromId } from '../../functions/testKey'

export function TestDetail({ testId, env }: { testId: string; env: TestEnv }) {
  const testKey = getTestKeyFromId(testId, env)
  const testData = useAtomValue(testDetailAtomFamily(testKey))
  const tests = useAtomValue(testsAtom)
  const resetTestResult = useSetAtom(resetTestResultAtom)

  const [testResult, setTestResult] = useAtom(testResultsAtomFamily(testKey))

  const isFirstTestId = tests.indexOf(testId) === 0
  const isLastTestId = tests.indexOf(testId) === tests.length - 1

  const prevTestId = () => {
    // 今の画面が音声閲覧環境だったら、前は同じテストIDの視覚閲覧環境
    if (env === 'sound') {
      return testId
    }

    const currentIndex = tests.indexOf(testId)
    if (currentIndex > 0) {
      return tests[currentIndex - 1]
    }
    return ''
  }

  const nextTestId = () => {
    // 今の画面が視覚閲覧環境だったら、次は同じテストIDの音声閲覧環境
    if (env === 'sight') {
      return testId
    }

    const currentIndex = tests.indexOf(testId)
    if (currentIndex >= 0 && currentIndex < tests.length - 1) {
      return tests[currentIndex + 1]
    }
    return ''
  }

  const handleEditTestResult = (updatedResult: Partial<typeof testResult>) => {
    const dateParts = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).formatToParts(new Date())
    const dateString = dateParts
      .filter(({ type }) => type !== 'literal')
      .map(({ value }) => value)
      .join('-')

    setTestResult((prev) => ({
      ...prev,
      ...updatedResult,
      date: dateString // TODO: testResultsAtomFamilyのset時にできるとベスト
    }))
  }

  const handleResetTestResult = () => {
    if (confirm('本当にこのテストの結果をリセットしますか？')) {
      resetTestResult(testKey)
    }
  }

  return (
    <div>
      <Link to="/">一覧へ</Link>
      <h1>
        {testId}
        {testData.title}
      </h1>
      <div>
        <ul>
          <li>
            <a href={testData.link} target="_blank" rel="noopener noreferrer">
              テストの詳細へ
            </a>
          </li>
          <li>
            <a href={testData.testCodeLink} target="_blank" rel="noopener noreferrer">
              テストコードへ
            </a>
          </li>
        </ul>
        <button onClick={handleResetTestResult} type="button">
          このテストの結果をクリア
        </button>
      </div>
      <div>
        <section>
          <h2>テスト方法</h2>
          <section>
            <h3>手順</h3>
            <p>{testData.procedure}</p>
          </section>
          <section>
            <h3>注意事項</h3>
            <p>{testData.notes}</p>
            <label>
              <span>行った操作</span>
              <textarea
                value={testResult.operation}
                onChange={(e) =>
                  handleEditTestResult({
                    ...testResult,
                    operation: e.target.value
                  })
                }
              />
            </label>
          </section>
        </section>
        <section>
          <h2>期待される結果</h2>
          <p>{testData.expectedResult}</p>
          <label>
            <span>操作の結果</span>
            <textarea
              value={testResult.result}
              onChange={(e) =>
                handleEditTestResult({
                  ...testResult,
                  result: e.target.value
                })
              }
            />
          </label>
          <section>
            <h3>期待される結果を満たしているかどうか</h3>
            <div>
              <button
                type="button"
                onClick={() =>
                  handleEditTestResult({
                    ...testResult,
                    isSatisfied: true
                  })
                }
              >
                <Circle />
                満たしている
              </button>
              <button
                type="button"
                onClick={() =>
                  handleEditTestResult({
                    ...testResult,
                    isSatisfied: false
                  })
                }
              >
                <X />
                満たしていない
              </button>
            </div>
          </section>
        </section>
      </div>
      <nav>
        {!isFirstTestId && (
          <Link
            to="/$testId"
            params={{ testId: prevTestId() }}
            search={env === 'sound' ? { env: 'sight' } : { env: 'sound' }}
          >
            前のテストへ
          </Link>
        )}
        <Link to="/">一覧へ</Link>
        {!isLastTestId && (
          <Link
            to="/$testId"
            params={{ testId: nextTestId() }}
            search={env === 'sound' ? { env: 'sight' } : { env: 'sound' }}
          >
            次のテストへ
          </Link>
        )}
      </nav>
    </div>
  )
}
