import { atom } from 'jotai'
import { getApiBaseUrl } from '../utils/api'

export interface TestListItem {
  testId: string
  title: string
}
interface TestList {
  tests: TestListItem[]
}

export const testsAtom = atom(async () => {
  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}/api`)
  const data: TestList = await response.json()
  return data.tests
})

export const testIdsAtom = atom(async (get) => {
  const tests = await get(testsAtom)
  return tests.map((test) => test.testId)
})
