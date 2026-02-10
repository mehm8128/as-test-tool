import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { atomFamily } from 'jotai-family'
import { testIdsAtom } from './testList'
import { getTestIdAndEnvFromKey, getTestKeyFromId } from '../functions/testKey'
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

const initialTestResult = (testId: string, env: TestEnv, opAndResultNum: number): TestResult => ({
  date: '',
  testId,
  env,
  operationAndResults: Array(opAndResultNum).fill({
    operation: '',
    result: '',
    isSatisfied: undefined
  })
})

export const testResultsAtomFamily = atomFamily((key: string) => {
  const { testId, env } = getTestIdAndEnvFromKey(key)
  return atomWithStorage<TestResult>(`waic-test-result-${key}`, initialTestResult(testId, env))
})

export const resetTestResultAtom = atom(null, (_get, set, key: string) => {
  const { testId, env } = getTestIdAndEnvFromKey(key)
  set(testResultsAtomFamily(key), initialTestResult(testId, env, opAndResultNum))
})

export const testResultsAtom = atom((get) => {
  const allTests = get(testIdsAtom)

  const results = allTests
    .flatMap((testId) => {
      const sightTest = get(testResultsAtomFamily(getTestKeyFromId(testId, 'sight')))
      const soundTest = get(testResultsAtomFamily(getTestKeyFromId(testId, 'sound')))
      return [sightTest, soundTest]
    })
    .filter((test) => test.operationAndResults.every((o) => o.isSatisfied !== undefined))
  return results
})

export const resetTestResultsAtom = atom(null, (get, set) => {
  const allTestResults = get(testResultsAtom)

  for (const testResult of allTestResults) {
    const key = getTestKeyFromId(testResult.testId, testResult.env)
    set(resetTestResultAtom, key)
  }
})

export const isCompletedAtom = atom((get) => {
  return (key: string) => {
    const testResult = get(testResultsAtomFamily(key))
    return testResult.operationAndResults.every((o) => o.isSatisfied !== undefined)
  }
})
