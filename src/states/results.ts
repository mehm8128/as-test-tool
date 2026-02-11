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

/**
 * 指定したkeyのテスト結果を保持するatom。
 * localStorageと同期している。
 * 初期化の問題があるので、localStorageにデータがないときは、useStateで改めて初期化する必要がある。
 */
export const testResultsAtomFamily = atomFamily((key: string) => {
  // NOTE: operationAndResultsの数をatomWithStorageの初期値で調整できないので、ここではnullに初期化し、入力フォーム側で初期化する
  // NOTE: atomWithStorageはデフォルトの挙動として最初に1回初期値でレンダリングし、その後localStorageの値に書き換える。
  // それを防ぐために、getOnInit: trueにしている
  return atomWithStorage<TestResult | null>(`waic-test-result-${key}`, null, undefined, {
    getOnInit: true
  })
})

/**
 * 指定したkeyのテスト結果をリセットするためのsetter atom。
 */
export const resetTestResultAtom = atom(null, (_get, set, key: string) => {
  set(testResultsAtomFamily(key), null)
})

/**
 * 全てのテスト結果をリセットするためのsetter atom。
 */
export const resetTestResultsAtom = atom(null, (get, set) => {
  const allTestResults = get(testResultsAtom)

  for (const testResult of allTestResults) {
    const key = getTestKeyFromId(testResult.testId, testResult.env)
    set(resetTestResultAtom, key)
  }
})

/**
 * 完了したテストの結果を保持し、CSV出力に利用可能にするatom。
 * 複数手順あるテストは、全ての手順において期待される結果を満たしているかどうかの判断をしないと完了とみなされない。
 */
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

/**
 * 指定したkeyのテストが完了しているかどうかを返すatom。
 * 複数手順あるテストは、全ての手順において期待される結果を満たしているかどうかの判断をしないと完了とみなされない。
 */
export const isCompletedAtom = atomFamily((key: string) =>
  atom((get) => {
    const testResult = get(testResultsAtomFamily(key))
    return (
      testResult !== null &&
      testResult.operationAndResults.every((o) => o.isSatisfied !== undefined)
    )
  })
)
