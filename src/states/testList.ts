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

export const testsAtom = unwrap(testsAsyncAtom, (prev) => prev ?? [])

export const testIdsAtom = atom((get) => {
  const tests = get(testsAtom)
  return tests.map((test) => test.testId)
})
