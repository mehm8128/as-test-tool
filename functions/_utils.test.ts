import { describe, it, expect } from 'vitest'
import {
  extractSections,
  extractTestCodeLink,
  extractTitleContent,
  extractNotesContent,
  extractProceduresContent,
  extractResultsContent,
  extractProcedureAndExpectedResultsContent,
  extractTests,
  generateTestLink,
  normalizeProcedureAndExpectedResults
} from './_utils'

describe('_utils', () => {
  it('extractSections', () => {
    const content = `# テストのタイトル

サンプルテスト

# テストコード (テストファイルへのリンク)

[WAIC-CODE-0001-01](https://waic.github.io/as_test/WAIC-CODE/WAIC-CODE-0001-01.html)

# テスト手順 (視覚閲覧環境)

1. 手順1
2. 手順2

# 期待される結果 (視覚閲覧環境)

期待される結果の内容

# テスト実施時の注意点 (視覚閲覧環境)

注意点の内容

# テスト手順と期待される結果 (視覚閲覧環境)

## テスト手順 1

手順は以下の通りです。

1. 手順1-1
2. 手順1-2

## 期待される結果 1

期待される結果。

## テスト手順 2

1. 手順2-2

## 期待される結果 2

1. 期待される結果 2

# テスト実施時の注意点 (視覚閲覧環境)

なし
`

    const sections = extractSections(content)

    expect(sections).toHaveLength(7)

    expect(sections[0].title).toBe('テストのタイトル')
    expect(sections[0].content).toBe('サンプルテスト')
    expect(sections[0].depth).toBe(1)
    expect(sections[0].children).toHaveLength(0)

    expect(sections[1].title).toBe('テストコード (テストファイルへのリンク)')
    expect(sections[1].content).toBe(
      '[WAIC-CODE-0001-01](https://waic.github.io/as_test/WAIC-CODE/WAIC-CODE-0001-01.html)'
    )
    expect(sections[1].depth).toBe(1)
    expect(sections[1].children).toHaveLength(0)

    expect(sections[2].title).toBe('テスト手順 (視覚閲覧環境)')
    expect(sections[2].content).toBe('1. 手順1\n2. 手順2')
    expect(sections[2].depth).toBe(1)
    expect(sections[2].children).toHaveLength(0)

    expect(sections[3].title).toBe('期待される結果 (視覚閲覧環境)')
    expect(sections[3].content).toBe('期待される結果の内容')
    expect(sections[3].depth).toBe(1)
    expect(sections[3].children).toHaveLength(0)

    expect(sections[4].title).toBe('テスト実施時の注意点 (視覚閲覧環境)')
    expect(sections[4].content).toBe('注意点の内容')
    expect(sections[4].depth).toBe(1)
    expect(sections[4].children).toHaveLength(0)

    expect(sections[5].title).toBe('テスト手順と期待される結果 (視覚閲覧環境)')
    expect(sections[5].content).toBe('')
    expect(sections[5].depth).toBe(1)
    expect(sections[5].children).toHaveLength(4)

    // h2
    {
      expect(sections[5].children[0].title).toBe('テスト手順 1')
      expect(sections[5].children[0].content).toBe(
        '手順は以下の通りです。\n\n1. 手順1-1\n2. 手順1-2'
      )
      expect(sections[5].children[0].depth).toBe(2)
      expect(sections[5].children[0].children).toHaveLength(0)

      expect(sections[5].children[1].title).toBe('期待される結果 1')
      expect(sections[5].children[1].content).toBe('期待される結果。')
      expect(sections[5].children[1].depth).toBe(2)
      expect(sections[5].children[1].children).toHaveLength(0)

      expect(sections[5].children[2].title).toBe('テスト手順 2')
      expect(sections[5].children[2].content).toBe('1. 手順2-2')
      expect(sections[5].children[2].depth).toBe(2)
      expect(sections[5].children[2].children).toHaveLength(0)

      expect(sections[5].children[3].title).toBe('期待される結果 2')
      expect(sections[5].children[3].content).toBe('1. 期待される結果 2')
      expect(sections[5].children[3].depth).toBe(2)
      expect(sections[5].children[3].children).toHaveLength(0)
    }

    expect(sections[6].title).toBe('テスト実施時の注意点 (視覚閲覧環境)')
    expect(sections[6].content).toBe('なし')
    expect(sections[6].depth).toBe(1)
    expect(sections[6].children).toHaveLength(0)
  })

  it('extractTestCodeLink', () => {
    const sections = [
      {
        title: 'テストコード (テストファイルへのリンク)',
        content:
          '[WAIC-CODE-0001-01](https://waic.github.io/as_test/WAIC-CODE/WAIC-CODE-0001-01.html)',
        depth: 1,
        children: []
      }
    ]
    const result = extractTestCodeLink(sections)
    expect(result).toBe('https://waic.github.io/as_test/WAIC-CODE/WAIC-CODE-0001-01.html')
  })

  it('extractTitleContent', async () => {
    const sections = [
      {
        title: 'テストのタイトル',
        content: 'サンプルテスト',
        depth: 1,
        children: []
      }
    ]
    const result = extractTitleContent(sections)
    expect(result).toBe('サンプルテスト')
  })

  it('extractNotesContent', async () => {
    const sections = [
      {
        title: 'テスト実施時の注意点 (視覚閲覧環境)',
        content: '注意点の内容',
        depth: 1,
        children: []
      }
    ]
    const result = await extractNotesContent(sections, 'sight')
    expect(result).toBe('<p>注意点の内容</p>')
  })

  it('extractProceduresContent', async () => {
    const sections = [
      {
        title: 'テスト手順 (視覚閲覧環境)',
        content: '1. 手順1\n2. 手順2',
        depth: 1,
        children: []
      }
    ]
    const result = await extractProceduresContent(sections, 'sight')
    expect(result).toBe('<ol>\n<li>手順1</li>\n<li>手順2</li>\n</ol>')
  })

  it('extractResultsContent', async () => {
    const sections = [
      {
        title: '期待される結果 (視覚閲覧環境)',
        content: '期待される結果の内容',
        depth: 1,
        children: []
      }
    ]
    const result = await extractResultsContent(sections, 'sight')
    expect(result).toBe('<p>期待される結果の内容</p>')
  })

  it('extractProcedureAndExpectedResultsContent', async () => {
    const sections = [
      {
        title: 'テスト手順と期待される結果 (視覚閲覧環境)',
        content: '',
        depth: 1,
        children: [
          {
            title: 'テスト手順 1',
            content: '手順1の内容',
            depth: 2,
            children: []
          },
          {
            title: '期待される結果 1',
            content: '結果1の内容',
            depth: 2,
            children: []
          },
          {
            title: 'テスト手順 2',
            content: '手順2の内容',
            depth: 2,
            children: []
          },
          {
            title: '期待される結果 2',
            content: '結果2の内容',
            depth: 2,
            children: []
          }
        ]
      }
    ]
    const result = await extractProcedureAndExpectedResultsContent(sections, 'sight')
    expect(result).toHaveLength(2)
    expect(result?.[0].procedure).toBe('<p>手順1の内容</p>')
    expect(result?.[0].expectedResult).toBe('<p>結果1の内容</p>')
    expect(result?.[1].procedure).toBe('<p>手順2の内容</p>')
    expect(result?.[1].expectedResult).toBe('<p>結果2の内容</p>')
  })

  it('extractTests', () => {
    const content = `
[0001-01: テスト1](link1.html)
[0001-02: テスト2](link2.html)
[0002-01: テスト3](link3.html)
    `
    const result = extractTests(content)
    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ testId: '0001-01', title: 'テスト1' })
    expect(result[1]).toEqual({ testId: '0001-02', title: 'テスト2' })
    expect(result[2]).toEqual({ testId: '0002-01', title: 'テスト3' })
  })

  it('generateTestLink', () => {
    const result = generateTestLink('0001-01')
    expect(result).toBe('https://waic.github.io/as_test/WAIC-TEST/HTML/0001-01.html')
  })

  describe('normalizeProcedureAndExpectedResults', () => {
    it('singleな方が選択される', () => {
      const singleProcedure = '手順'
      const singleExpectedResult = '期待される結果'
      const result = normalizeProcedureAndExpectedResults(
        singleProcedure,
        singleExpectedResult,
        undefined
      )
      expect(result).toEqual([{ procedure: singleProcedure, expectedResult: singleExpectedResult }])
    })
    it('multipleな方が選択される', () => {
      const procedureAndExpectedResults = [
        { procedure: '手順1', expectedResult: '期待される結果1' },
        { procedure: '手順2', expectedResult: '期待される結果2' }
      ]
      const result = normalizeProcedureAndExpectedResults(
        undefined,
        undefined,
        procedureAndExpectedResults
      )
      expect(result).toEqual(procedureAndExpectedResults)
    })
  })
})
