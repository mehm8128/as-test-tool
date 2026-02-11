import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'
import { getApiBaseUrl } from '../utils/api'

export interface TestListItem {
  testId: string
  title: string
}
interface TestList {
  tests: TestListItem[]
}

const testsAsyncAtom = atom(async () => {
  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}/api`)
  const data: TestList = await response.json()
  return data.tests
})

/**
 * ASテストのデータを取得して保持するatom。
 * 最初に2回Suspendされて画面がちらつくのを防ぐため、unwrapを利用している。
 */
export const testsAtom = unwrap(testsAsyncAtom, (prev) => prev ?? [])

/**
 * ASテストのIDのみ配列として取得するatom。
 */
export const testIdsAtom = atom((get) => {
  const tests = get(testsAtom)
  return tests.map((test) => test.testId)
})
