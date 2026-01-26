import { atom } from 'jotai'
import { getApiBaseUrl } from '../utils/api'

interface TestDetail {
  tests: string[]
}

export const testsAtom = atom(async () => {
  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}/api`)
  const data: TestDetail = await response.json()
  return data.tests
})
