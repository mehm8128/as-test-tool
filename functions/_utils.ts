import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import type { ProcedureAndExpectedResult } from './api/[[route]]'

export type EnvType = 'sight' | 'sound'

const envNameMap = {
  sight: '視覚閲覧環境',
  sound: '音声閲覧環境'
} as const satisfies Record<EnvType, string>

const extractSection = (content: string, sectionTitle: string, env: EnvType) => {
  const envName = envNameMap[env]
  const pattern = new RegExp(
    `^# ${sectionTitle} \\(${envName}\\)\\s*\\n\\n([\\s\\S]*?)\\n\\n#`,
    'm'
  )
  const match = content.match(pattern)
  if (match) {
    return match[1].trim()
  }

  // 最後のセクションの場合、文字列の終端まで取得
  const endPattern = new RegExp(`^# ${sectionTitle} \\(${envName}\\)\\s*\\n\\n([\\s\\S]*)$`, 'm')
  const endMatch = content.match(endPattern)
  return endMatch ? endMatch[1].trim() : undefined
}

const extractMultipleProceduresSection = (content: string, sectionTitle: string) => {
  const pattern = new RegExp(`^## ${sectionTitle}\\s*\\n\\n([\\s\\S]*?)\\n\\n#`, 'm')
  const match = content.match(pattern)
  if (match) {
    return match[1].trim()
  }

  // 最後のセクションの場合、文字列の終端まで取得
  const endPattern = new RegExp(`^## ${sectionTitle}\\s*\\n\\n([\\s\\S]*)$`, 'm')
  const endMatch = content.match(endPattern)
  return endMatch ? endMatch[1].trim() : undefined
}

export const extractTestTitle = (content: string): string => {
  const titleMatch = content.match(/^# テストのタイトル\s*\n\n(.*)$/m)
  return titleMatch ? titleMatch[1].trim() : 'Untitled'
}

export const extractTestCodeLink = (content: string): string => {
  const codeLinkMatch = content.match(/^# テストコード \(テストファイルへのリンク\)\s*\n\n(.*)$/m)
  const testCodeLinkMd = codeLinkMatch ? codeLinkMatch[1].trim() : undefined
  if (!testCodeLinkMd) {
    return 'No Test code link found'
  }
  const urlMatch = testCodeLinkMd.match(/\[(.*?)\]\((.*?)\)/)
  return urlMatch ? urlMatch[2] : 'No Test code link found'
}

export const extractTestProcedure = (content: string, env: EnvType): string => {
  const result = extractSection(content, 'テスト手順', env)
  return result ?? 'No procedure found'
}

export const extractTestExpectedResult = (content: string, env: EnvType): string => {
  const result = extractSection(content, '期待される結果', env)
  return result ?? 'No expected result found'
}

export const getIsMultipleProcedures = (content: string, env: EnvType): boolean => {
  const envName = envNameMap[env]
  const pattern = new RegExp(`^# テスト手順と期待される結果 \\(${envName}\\)\\s*\\n\\n`, 'm')
  return pattern.test(content)
}

export const extractMultipleProcedures = (content: string): ProcedureAndExpectedResult[] => {
  const result: ProcedureAndExpectedResult[] = []
  let index = 1
  while (true) {
    const procedure = extractMultipleProceduresSection(content, `テスト手順 ${index}`)
    const expectedResult = extractMultipleProceduresSection(content, `期待される結果 ${index}`)
    if (!procedure || !expectedResult) {
      break
    }
    result.push({
      procedure: procedure,
      expectedResult: expectedResult
    })
    index++
  }
  return result
}

export const extractTestNotes = (content: string, env: EnvType): string => {
  const result = extractSection(content, 'テスト実施時の注意点', env)
  return result ?? 'No notes found'
}

export const generateTestLink = (filename: string): string => {
  return `https://waic.github.io/as_test/WAIC-TEST/HTML/${filename}.html`
}

/**
 * テスト一覧から全てのテストを取得する。
 */
export const extractTests = (content: string): { testId: string; title: string }[] => {
  const testLinks = content.matchAll(/\[(.*?)\]\(.*\)/g)

  const testLinksArray = Array.from(testLinks)
  const filteredTestLinks = testLinksArray
    .map((match) => {
      const linkText = match[1]
      const testIdAndTitleMatch = linkText.match(/^([0-9]{4}-[0-9]{2}): (.*?)$/)
      return {
        testId: testIdAndTitleMatch ? testIdAndTitleMatch[1] : null,
        title: testIdAndTitleMatch ? testIdAndTitleMatch[2] : null
      }
    })
    .filter(
      (testIdAndTitle): testIdAndTitle is { testId: string; title: string } =>
        testIdAndTitle.testId !== null && testIdAndTitle.title !== null
    )

  return filteredTestLinks
}

export const markdownToHtml = async (markdown: string): Promise<string> => {
  const file = await unified()
    .use(remarkParse) // Markdownをパース
    .use(remarkRehype) // MarkdownのASTをHTMLのASTに変換
    .use(rehypeSanitize) // XSS対策のためHTMLをサニタイズ
    .use(rehypeStringify) // HTMLのASTを文字列に変換
    .process(markdown)

  return file.toString()
}
