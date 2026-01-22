import { atom } from 'jotai'
import type { Setting, TestResult } from './schema'

export const settingAtom = atom<Setting>({
	name: '',
	email: '',
	os: '',
	browser: '',
	at: '',
	asSetting: ''
})

export const testResultsAtom = atom<TestResult[]>([])
