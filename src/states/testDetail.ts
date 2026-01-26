import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import { getApiBaseUrl } from '../utils/api'
import { getTestIdAndEnvFromKey } from '../functions/testKey'

export type TestEnv = 'sight' | 'sound'

export interface TestDetail {
  filename: string
  title: string
  procedure: string
  expectedResult: string
  notes: string
  link: string
  testCodeLink: string | undefined
  env: TestEnv
}

export const testDetailAtomFamily = atomFamily((key: string) =>
  atom(async () => {
    const { testId, env } = getTestIdAndEnvFromKey(key)
    const baseUrl = getApiBaseUrl()
    let url = `${baseUrl}/api/${testId}`
    if (env) {
      url += `?env=${env}`
    }
    const response = await fetch(url)
    return (await response.json()) as TestDetail
  })
)
