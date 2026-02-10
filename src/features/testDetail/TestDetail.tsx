import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { resetTestResultAtom, testResultsAtomFamily, type TestResult } from '../../states/results'
import { testDetailAtomFamily, type TestEnv } from '../../states/testDetail'
import { testIdsAtom } from '../../states/testList'
import { getTestKeyFromId } from '../../functions/testKey'
import { Button } from '../../components/Button/Button'
import { AnchorLink, ExternalAnchorLink } from '../../components/AnchorLink/AnchorLink'
import { Textarea } from '../../components/Textarea/Textarea'
import { Label } from '../../components/Label/Label'
import { Heading } from '../../components/Heading/Heading'
import { MarkdownContent } from '../../components/MarkdownContent/MarkdownContent'
import styles from './TestDetail.module.css'
import { useId, useState } from 'react'
import { SatisfiedRadio } from './components/SatisifedRadio'
import { useTitle } from '../../hooks/useTitle'

export function TestDetail({ testId, env }: { testId: string; env: TestEnv }) {
  const testKey = getTestKeyFromId(testId, env)
  const testData = useAtomValue(testDetailAtomFamily(testKey))
  const testIds = useAtomValue(testIdsAtom)
  const resetTestResult = useSetAtom(resetTestResultAtom)
  const satisfiedRadioFieldId = useId()

  const [savedTestResult, setSavedTestResult] = useAtom(testResultsAtomFamily(testKey))

  // operationAndResultsの数をatomWithStorageの初期値で調整できないので、ここで初期化している
  const [formState, setFormState] = useState<TestResult>(() => {
    const opAndResultNum = testData.procedureAndExpectedResults.length
    return (
      savedTestResult ?? {
        date: '',
        testId,
        env,
        operationAndResults: Array(opAndResultNum)
          .fill(null)
          .map(() => ({
            operation: '',
            result: '',
            isSatisfied: undefined
          }))
      }
    )
  })

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

  const handleEditTestResult = (updatedResult: Partial<TestResult>) => {
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

    setFormState({
      ...formState,
      ...updatedResult,
      date: dateString
    })
    setSavedTestResult({
      ...formState,
      ...updatedResult,
      date: dateString
    })
  }

  const handleResetTestResult = () => {
    if (confirm('本当にこのテストの結果をリセットしますか？')) {
      resetTestResult(testKey)
      const opAndResultNum = testData.procedureAndExpectedResults.length
      setFormState({
        date: '',
        testId,
        env,
        operationAndResults: Array(opAndResultNum)
          .fill(null)
          .map(() => ({
            operation: '',
            result: '',
            isSatisfied: undefined
          }))
      })
    }
  }

  useTitle(`${testData.title} - AS Test Tool`)

  return (
    <>
      <div className={styles.module}>
        <div className={styles.header}>
          <AnchorLink to="/">一覧へ</AnchorLink>
          <Heading level={1}>
            <span>
              <span className={styles.testId}>{testId}</span>
              <span>{testData.title}</span>
            </span>
          </Heading>
          <div className={styles.buttons}>
            <ul className={styles.headerUl}>
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
        <form className={styles.form}>
          <section className={styles.howToTest}>
            <Heading level={2}>テスト方法</Heading>
            <section className={styles.innerSection}>
              <Heading level={3}>テスト実施時の注意点</Heading>
              <MarkdownContent html={testData.notes} />
            </section>
            {testData.procedureAndExpectedResults.map((procedureAndExpectedResult, index) => (
              <div key={index} className={styles.testProcedure}>
                <section className={styles.section}>
                  <div className={styles.innerSection}>
                    <Heading level={3}>手順 {index + 1}</Heading>
                    <MarkdownContent html={procedureAndExpectedResult.procedure} />
                  </div>
                  <Label labelText={`行った操作 ${index + 1}`}>
                    <Textarea
                      value={formState.operationAndResults[index].operation}
                      onChange={(value) =>
                        handleEditTestResult({
                          ...formState,
                          operationAndResults: formState.operationAndResults.map((o, i) =>
                            i === index ? { ...o, operation: value } : o
                          )
                        })
                      }
                    />
                  </Label>
                </section>
                <section className={styles.section}>
                  <div className={styles.innerSection}>
                    <Heading level={3}>期待される結果 {index + 1}</Heading>
                    <MarkdownContent html={procedureAndExpectedResult.expectedResult} />
                  </div>
                  <Label labelText={`操作の結果 ${index + 1}`}>
                    <Textarea
                      value={formState.operationAndResults[index].result}
                      onChange={(value) =>
                        handleEditTestResult({
                          ...formState,
                          operationAndResults: formState.operationAndResults.map((o, i) =>
                            i === index ? { ...o, result: value } : o
                          )
                        })
                      }
                    />
                  </Label>
                </section>
                <section className={styles.innerSection}>
                  <Heading level={3} id={satisfiedRadioFieldId}>
                    期待される結果 {index + 1}を満たしているかどうか
                  </Heading>
                  <SatisfiedRadio
                    id={satisfiedRadioFieldId}
                    isSatisfied={formState.operationAndResults[index].isSatisfied}
                    onEditIsSatisfied={(isSatisfied) =>
                      handleEditTestResult({
                        ...formState,
                        operationAndResults: formState.operationAndResults.map((o, i) =>
                          i === index ? { ...o, isSatisfied } : o
                        )
                      })
                    }
                  />
                </section>
              </div>
            ))}
          </section>
        </form>
        <nav className={styles.nav}>
          <div className={styles.footerUl}>
            {!isFirstTestId && (
              <AnchorLink
                to="/$testId"
                params={{ testId: prevTestId() }}
                search={env === 'sound' ? { env: 'sight' } : { env: 'sound' }}
              >
                前のテストへ
              </AnchorLink>
            )}
            {!isLastTestId && (
              <AnchorLink
                to="/$testId"
                params={{ testId: nextTestId() }}
                search={env === 'sound' ? { env: 'sight' } : { env: 'sound' }}
              >
                次のテストへ
              </AnchorLink>
            )}
          </div>
          <AnchorLink to="/">一覧へ</AnchorLink>
        </nav>
      </div>
    </>
  )
}
