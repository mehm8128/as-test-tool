import { describe, it, expect } from 'vitest'
import {
  extractTestTitle,
  extractTestProcedure,
  extractTestExpectedResult,
  extractTestNotes
} from './_utils'

describe('extractor', () => {
  it('各セクションの情報を取得できる', () => {
    const content = `# テストのタイトル

サンプルテスト

# テスト手順 (視覚閲覧環境)

1. 手順1
2. 手順2

# 期待される結果 (視覚閲覧環境)

期待される結果の内容

# テスト実施時の注意点 (視覚閲覧環境)

注意点の内容

# テスト手順 (音声閲覧環境)

1. 音声手順1
2. 音声手順2

# 期待される結果 (音声閲覧環境)

音声期待される結果の内容

# テスト実施時の注意点 (音声閲覧環境)

音声注意点の内容

`

    const title = extractTestTitle(content)
    const procedureSight = extractTestProcedure(content, 'sight')
    const expectedResultSight = extractTestExpectedResult(content, 'sight')
    const notesSight = extractTestNotes(content, 'sight')
    const procedureSound = extractTestProcedure(content, 'sound')
    const expectedResultSound = extractTestExpectedResult(content, 'sound')
    const notesSound = extractTestNotes(content, 'sound')

    expect(title).toBe('サンプルテスト')
    expect(procedureSight).toBe('1. 手順1\n2. 手順2')
    expect(expectedResultSight).toBe('期待される結果の内容')
    expect(notesSight).toBe('注意点の内容')
    expect(procedureSound).toBe('1. 音声手順1\n2. 音声手順2')
    expect(expectedResultSound).toBe('音声期待される結果の内容')
    expect(notesSound).toBe('音声注意点の内容')
  })
})
