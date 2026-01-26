import { describe, it, expect } from 'vitest'
import { resultToCsvRow } from './exportToCSV'
import type { TestResult } from '../../../states/results'
import type { Setting } from '../../../states/setting'

describe('exportToCsv', () => {
  it('内容を保ったまま必要な情報をCSV形式でエクスポートできる', () => {
    const results: TestResult[] = [
      {
        date: '2026-1-26',
        testId: '0001-01',
        env: 'sight',
        operation: 'operation1',
        result: 'result1',
        isSatisfied: false
      },
      {
        date: '2026-1-26',
        testId: '0001-01',
        env: 'sound',
        operation: 'operation2',
        result: 'result2',
        isSatisfied: true
      },
      {
        date: '2026-1-26',
        testId: '0001-02',
        env: 'sight',
        operation: 'operation3',
        result: 'result3',
        isSatisfied: true
      }
    ]

    const setting: Setting = {
      name: 'nameeee',
      email: 'emaillll@example.com',
      os: 'ossssss',
      browser: 'browserrrrrr',
      at: 'atttttt',
      atSetting: 'atSettingggggg'
    }

    const resultLines = results.map((result) => resultToCsvRow(result, setting))
    expect(resultLines[0]).toBe(
      `"2026-1-26","nameeee","emaillll@example.com","ossssss","browserrrrrr","atttttt","atSettingggggg","'0001-01","視覚閲覧環境","operation1","result1","満たしていない"`
    )
    expect(resultLines[1]).toBe(
      `"2026-1-26","nameeee","emaillll@example.com","ossssss","browserrrrrr","atttttt","atSettingggggg","'0001-01","音声閲覧環境","operation2","result2","満たしている"`
    )
    expect(resultLines[2]).toBe(
      `"2026-1-26","nameeee","emaillll@example.com","ossssss","browserrrrrr","atttttt","atSettingggggg","'0001-02","視覚閲覧環境","operation3","result3","満たしている"`
    )
  })
})
