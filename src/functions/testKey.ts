/**
 * @fileoverview
 * jotai上でtestId|envという形式のキーを扱うため、相互変換処理を定義している
 */

import type { TestEnv } from '../states/testDetail'

/**
 * testIdとenvから、testId|env形式のキーを生成する
 */
export const getTestKeyFromId = (testId: string, env: TestEnv): string => {
  return `${testId}|${env}`
}

/**
 * testId|env形式のキーから、testIdとenvを取得する
 */
export const getTestIdAndEnvFromKey = (key: string): { testId: string; env: TestEnv } => {
  const [testId, env] = key.split('|')

  return { testId, env: parseEnv(env) }
}

const parseEnv = (env: string): TestEnv => {
  if (env === 'sight' || env === 'sound') {
    return env
  }
  return 'sight'
}
