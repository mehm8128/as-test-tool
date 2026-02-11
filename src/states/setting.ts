import { atomWithStorage } from 'jotai/utils'

export interface Setting {
  name: string
  email: string
  os: string
  browser: string
  at: string
  atSetting: string
}

/**
 * ユーザーの設定情報を保持するatom。
 * localStorageと同期している。
 */
export const settingAtom = atomWithStorage<Setting>('waic-test-setting', {
  name: '',
  email: '',
  os: '',
  browser: '',
  at: '',
  atSetting: ''
})
