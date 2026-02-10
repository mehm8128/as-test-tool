import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { atomFamily } from 'jotai-family'
import { testIdsAtom } from './testList'
import { getTestKeyFromId } from '../functions/testKey'
import type { TestEnv } from './testDetail'

interface OperationAndResult {
  operation: string
  result: string
  isSatisfied: boolean | undefined
}
export interface TestResult {
  date: string
  testId: string
  env: TestEnv
  operationAndResults: OperationAndResult[]
}

export const testResultsAtomFamily = atomFamily((key: string) => {
  // operationAndResultsの数をatomWithStorageの初期値で調整できないので、ここではnullに初期化し、入力フォーム側で初期化する
  return atomWithStorage<TestResult | null>(`waic-test-result-${key}`, null)
})

export const resetTestResultAtom = atom(null, (_get, set, key: string) => {
  set(testResultsAtomFamily(key), null)
})

export const testResultsAtom = atom((get) => {
  const allTests = get(testIdsAtom)

  const results = allTests
    .flatMap((testId) => {
      const sightTest = get(testResultsAtomFamily(getTestKeyFromId(testId, 'sight')))
      const soundTest = get(testResultsAtomFamily(getTestKeyFromId(testId, 'sound')))
      return [sightTest, soundTest]
    })
    .filter(
      (test): test is TestResult =>
        test !== null && test.operationAndResults.every((o) => o.isSatisfied !== undefined)
    )
  return results
})

export const resetTestResultsAtom = atom(null, (get, set) => {
  const allTestResults = get(testResultsAtom)

  for (const testResult of allTestResults) {
    const key = getTestKeyFromId(testResult.testId, testResult.env)
    set(resetTestResultAtom, key)
  }
})

export const isCompletedAtom = atomFamily((key: string) =>
  atom((get) => {
    const testResult = get(testResultsAtomFamily(key))
    return (
      testResult !== null &&
      testResult.operationAndResults.every((o) => o.isSatisfied !== undefined)
    )
  })
)
