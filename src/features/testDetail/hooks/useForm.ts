import { useAtom, useSetAtom } from 'jotai'
import { useState } from 'react'
import {
  resetTestResultAtom,
  testResultsAtomFamily,
  type TestResult
} from '../../../states/results'
import type { TestDetail, TestEnv } from '../../../states/testDetail'

export const useForm = (testKey: string, testId: string, env: TestEnv, testData: TestDetail) => {
  const resetTestResult = useSetAtom(resetTestResultAtom)
  const [savedTestResult, setSavedTestResult] = useAtom(testResultsAtomFamily(testKey))

  // operationAndResultsの数をatomWithStorageの初期値で調整できないので、ここで初期化している
  const [formState, setFormState] = useState<TestResult>(() => {
    const opAndResultNum = testData.proceduresAndExpectedResults.length
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
      const opAndResultNum = testData.proceduresAndExpectedResults.length
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

  return {
    formState,
    handleEditTestResult,
    handleResetTestResult
  }
}
