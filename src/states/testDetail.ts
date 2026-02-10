import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import { getApiBaseUrl } from '../utils/api'
import { getTestIdAndEnvFromKey } from '../functions/testKey'

export type TestEnv = 'sight' | 'sound'

interface ProcedureAndExpectedResult {
  procedure: string
  expectedResult: string
}
export interface TestDetail {
  filename: string
  title: string
  procedureAndExpectedResults: ProcedureAndExpectedResult[]
  notes: string
  link: string
  testCodeLink: string
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
