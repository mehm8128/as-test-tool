import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { atomFamily } from 'jotai-family'
import { testsAtom } from './testList'
import { getTestIdAndEnvFromKey, getTestKeyFromId } from '../functions/testKey'
import type { TestEnv } from './testDetail'

export interface TestResult {
  date: string
  testId: string
  env: TestEnv
  operation: string // ここから下3つは将来的に複数になりそう
  result: string
  isSatisfied: boolean | undefined
}

const initialTestResult = (testId: string, env: TestEnv): TestResult => ({
  date: '',
  testId,
  env,
  operation: '',
  result: '',
  isSatisfied: undefined
})

export const testResultsAtomFamily = atomFamily((key: string) => {
  const { testId, env } = getTestIdAndEnvFromKey(key)
  return atomWithStorage<TestResult>(`waic-test-result-${key}`, initialTestResult(testId, env))
})

export const resetTestResultAtom = atom(null, (_get, set, key: string) => {
  const { testId, env } = getTestIdAndEnvFromKey(key)
  set(testResultsAtomFamily(key), initialTestResult(testId, env))
})

export const testResultsAtom = atom(async (get) => {
  const allTests = await get(testsAtom)

  const results = allTests
    .flatMap((testId) => {
      const sightTest = get(testResultsAtomFamily(getTestKeyFromId(testId, 'sight')))
      const soundTest = get(testResultsAtomFamily(getTestKeyFromId(testId, 'sound')))
      return [sightTest, soundTest]
    })
    .filter((test) => test.isSatisfied !== undefined)
  return results
})

export const resetTestResultsAtom = atom(null, async (get, set) => {
  const allTestResults = await get(testResultsAtom)

  for (const testResult of allTestResults) {
    const key = getTestKeyFromId(testResult.testId, testResult.env)
    set(resetTestResultAtom, key)
  }
})

export const isCompletedAtom = atom((get) => {
  return (key: string) => {
    const testResult = get(testResultsAtomFamily(key))
    return testResult.isSatisfied !== undefined
  }
})
