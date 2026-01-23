import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { atomFamily } from 'jotai-family'
import type { Setting, TestResult } from './schema'

export const settingAtom = atomWithStorage<Setting>('waic-test-setting', {
  name: '',
  email: '',
  os: '',
  browser: '',
  at: '',
  atSetting: ''
})

export const testResultsAtomFamily = atomFamily((key: string) => {
  const [filename, env] = key.split('|')
  return atomWithStorage<TestResult>(`waic-test-result-${key}`, {
    date: '',
    testNum: filename,
    env: env as 'sight' | 'sound',
    operation: '',
    result: '',
    isSatisfied: false
  })
})

export const editedTestsAtom = atomWithStorage<string[]>('waic-test-edited-tests', [])

export const testResultsAtom = atom((get) => {
  const editedTests = get(editedTestsAtom)

  const results = editedTests.map((key) => get(testResultsAtomFamily(key)))
  return results
})
