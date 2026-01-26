import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { resetTestResultAtom, testResultsAtomFamily } from '../../states/results'
import { Check } from 'lucide-react'
import { testDetailAtomFamily, type TestEnv } from '../../states/testDetail'
import { testIdsAtom } from '../../states/testList'
import { getTestKeyFromId } from '../../functions/testKey'
import { Button } from '../../components/Button/Button'
import { AnchorLink, ExternalAnchorLink } from '../../components/AnchorLink/AnchorLink'
import { Textarea } from '../../components/Textarea/Textarea'
import { Label } from '../../components/Label/Label'
import { Heading } from '../../components/Heading/Heading'
import styles from './TestDetail.module.css'

export function TestDetail({ testId, env }: { testId: string; env: TestEnv }) {
  const testKey = getTestKeyFromId(testId, env)
  const testData = useAtomValue(testDetailAtomFamily(testKey))
  const testIds = useAtomValue(testIdsAtom)
  const resetTestResult = useSetAtom(resetTestResultAtom)

  const [testResult, setTestResult] = useAtom(testResultsAtomFamily(testKey))

  const isFirstTestId = testIds.indexOf(testId) === 0
  const isLastTestId = testIds.indexOf(testId) === testIds.length - 1

  const prevTestId = () => {
    // 今の画面が音声閲覧環境だったら、前は同じテストIDの視覚閲覧環境
    if (env === 'sound') {
      return testId
    }

    const currentIndex = testIds.indexOf(testId)
    if (currentIndex > 0) {
      return testIds[currentIndex - 1]
    }
    return ''
  }

  const nextTestId = () => {
    // 今の画面が視覚閲覧環境だったら、次は同じテストIDの音声閲覧環境
    if (env === 'sight') {
      return testId
    }

    const currentIndex = testIds.indexOf(testId)
    if (currentIndex >= 0 && currentIndex < testIds.length - 1) {
      return testIds[currentIndex + 1]
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
    <>
      <title>{`${testData.title} - AS Test Tool`}</title>
      <div className={styles.module}>
        <div className={styles.header}>
          <div>
            <AnchorLink to="/">一覧へ</AnchorLink>
            <Heading level={1}>
              {testId}
              {testData.title}
            </Heading>
          </div>
          <div className={styles.buttons}>
            <ul className={styles.ul}>
              <li>
                <ExternalAnchorLink href={testData.link}>テストの詳細へ</ExternalAnchorLink>
              </li>
              <li>
                <ExternalAnchorLink href={testData.testCodeLink}>テストコードへ</ExternalAnchorLink>
              </li>
            </ul>
            <Button onClick={handleResetTestResult}>このテストの結果をリセット</Button>
          </div>
        </div>
        <div className={styles.form}>
          <section className={styles.section}>
            <Heading level={2}>テスト方法</Heading>
            <section className={styles.innerSection}>
              <Heading level={3}>手順</Heading>
              <p>{testData.procedure}</p>
            </section>
            <section className={styles.innerSection}>
              <Heading level={3}>注意事項</Heading>
              <p>{testData.notes}</p>
              <Label labelText="行った操作">
                <Textarea
                  value={testResult.operation}
                  onChange={(value) =>
                    handleEditTestResult({
                      ...testResult,
                      operation: value
                    })
                  }
                />
              </Label>
            </section>
          </section>
          <section className={styles.section}>
            <Heading level={2}>期待される結果</Heading>
            <p>{testData.expectedResult}</p>
            <Label labelText="操作の結果">
              <Textarea
                value={testResult.result}
                onChange={(value) =>
                  handleEditTestResult({
                    ...testResult,
                    result: value
                  })
                }
              />
            </Label>
            <section className={styles.innerSection}>
              <Heading level={3}>期待される結果を満たしているかどうか</Heading>
              <div
                role="group"
                aria-label="期待される結果を満たしているかどうか"
                className={styles.isSatisfiedGroup}
              >
                <Button
                  onClick={() =>
                    handleEditTestResult({
                      ...testResult,
                      isSatisfied: true
                    })
                  }
                  icon={testResult.isSatisfied && <Check />}
                  ariaPressed={testResult.isSatisfied === true}
                >
                  満たしている
                </Button>
                <Button
                  onClick={() =>
                    handleEditTestResult({
                      ...testResult,
                      isSatisfied: false
                    })
                  }
                  icon={testResult.isSatisfied === false && <Check />}
                  ariaPressed={testResult.isSatisfied === false}
                >
                  満たしていない
                </Button>
              </div>
            </section>
          </section>
        </div>
        <nav>
          <ul className={styles.ul}>
            {!isFirstTestId && (
              <li>
                <AnchorLink
                  to="/$testId"
                  params={{ testId: prevTestId() }}
                  search={env === 'sound' ? { env: 'sight' } : { env: 'sound' }}
                >
                  前のテストへ
                </AnchorLink>
              </li>
            )}
            {!isLastTestId && (
              <li>
                <AnchorLink
                  to="/$testId"
                  params={{ testId: nextTestId() }}
                  search={env === 'sound' ? { env: 'sight' } : { env: 'sound' }}
                >
                  次のテストへ
                </AnchorLink>
              </li>
            )}
            <li>
              <AnchorLink to="/">一覧へ</AnchorLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
