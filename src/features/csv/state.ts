import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { atomFamily } from 'jotai-family'
import type { Setting, TestResult } from './schema'
import { testsAtom } from '../testList/TestList'

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
    isSatisfied: undefined
  })
})

export const isJudgedAtom = atom((get) => {
  return (key: string) => {
    const testResult = get(testResultsAtomFamily(key))
    return testResult.isSatisfied !== undefined
  }
})

export const testResultsAtom = atom(async (get) => {
  const allTests = await get(testsAtom)

  const results = allTests
    .flatMap((filename) => {
      const sightTest = get(testResultsAtomFamily(`${filename}|sight`))
      const soundTest = get(testResultsAtomFamily(`${filename}|sound`))
      return [sightTest, soundTest]
    })
    .filter((test) => test.isSatisfied !== undefined)
  return results
})
