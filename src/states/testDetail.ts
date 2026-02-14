import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import { getTestIdAndEnvFromKey } from '../functions/testKey'

export type TestEnv = 'sight' | 'sound'

interface ProcedureAndExpectedResult {
  procedure: string
  expectedResult: string
}

export interface TestDetail {
  filename: string
  env: TestEnv
  title: string
  notes: string
  proceduresAndExpectedResults: ProcedureAndExpectedResult[]
  link: string
  testCodeLink: string
}

/**
 * 指定したkeyのASテストの情報を取得するatom。
 */
export const testDetailAtomFamily = atomFamily((key: string) =>
  atom(async () => {
    const { testId, env } = getTestIdAndEnvFromKey(key)
    let url = `/api/tests/html/${testId}`
    if (env) {
      url += `?env=${env}`
    }
    const response = await fetch(url)
    return (await response.json()) as TestDetail
  })
)
