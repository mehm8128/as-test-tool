import { atom } from 'jotai'
import { atomFamily } from 'jotai-family'
import type { Setting, TestResult } from './schema'

export const settingAtom = atom<Setting>({
  name: '',
  email: '',
  os: '',
  browser: '',
  at: '',
  atSetting: ''
})

export const testResultsAtomFamily = atomFamily((key: string) => {
  const [filename, env] = key.split('|')
  return atom<TestResult>({
    date: '',
    testNum: filename,
    env: env as 'sight' | 'sound',
    operation: '',
    result: '',
    isSatisfied: false
  })
})

export const editedTestsAtom = atom<string[]>([])

export const testResultsAtom = atom(async (get) => {
  const editedTests = get(editedTestsAtom)

  const results = editedTests.map((key) => get(testResultsAtomFamily(key)))
  return results
})
