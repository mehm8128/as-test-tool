import { useAtom } from 'jotai'
import { useState } from 'react'
import { getTestIdAndEnvFromKey } from '../../../functions/testKey'
import { testResultsAtomFamily, type TestResult } from '../../../states/results'
import type { TestDetail } from '../../../states/testDetail'

export const useForm = (testKey: string, testData: TestDetail) => {
  const { testId, env } = getTestIdAndEnvFromKey(testKey)
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

  return {
    formState,
    handleEditTestResult
  }
}
