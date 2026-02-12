import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkStringify from 'remark-stringify'
import type { Root, Heading, RootContent } from 'mdast'

export type EnvType = 'sight' | 'sound'

const envNameMap = {
  sight: '視覚閲覧環境',
  sound: '音声閲覧環境'
} as const satisfies Record<EnvType, string>

export const extractTestCodeLink = (sections: Section[]): string => {
  const codeLinkMatch = sections.find(
    (section) => section.title === 'テストコード (テストファイルへのリンク)'
  )
  const testCodeLinkMd = codeLinkMatch ? codeLinkMatch.content.trim() : undefined
  if (!testCodeLinkMd) {
    return 'No Test code link found'
  }
  const urlMatch = testCodeLinkMd.match(/\[(.*?)\]\((.*?)\)/)
  return urlMatch ? urlMatch[2] : 'No Test code link found'
}

export const extractTitleContent = (sections: Section[]) => {
  const titleContent =
    sections.find((section) => section.title === 'テストのタイトル')?.content ?? 'タイトル未設定'
  return titleContent
}

export const extractNotesContent = async (sections: Section[], env: EnvType) => {
  const notesContent =
    sections.find((section) => section.title === `テスト実施時の注意点 (${envNameMap[env]})`)
      ?.content ?? '特になし'
  const notesContentHtml = await markdownToHtml(notesContent)
  return notesContentHtml
}

export const extractProceduresContent = async (sections: Section[], env: EnvType) => {
  const proceduresContent = sections.find(
    (section) => section.title === `テスト手順 (${envNameMap[env]})`
  )?.content
  const proceduresContentHtml = await markdownToHtml(proceduresContent)
  return proceduresContentHtml
}

export const extractResultsContent = async (sections: Section[], env: EnvType) => {
  const resultsContent = sections.find(
    (section) => section.title === `期待される結果 (${envNameMap[env]})`
  )?.content
  const resultsContentHtml = await markdownToHtml(resultsContent)
  return resultsContentHtml
}

export interface ProcedureAndExpectedResult {
  procedure: string
  expectedResult: string
}
export const extractProcedureAndExpectedResultsContent = async (
  sections: Section[],
  env: EnvType
) => {
  const procedureAndResultsChildren = sections.find(
    (section) => section.title === `テスト手順と期待される結果 (${envNameMap[env]})`
  )?.children
  if (procedureAndResultsChildren === undefined) {
    return undefined
  }

  const result: ProcedureAndExpectedResult[] = []

  for (let i = 0; i < procedureAndResultsChildren.length; i += 2) {
    const procedureChild = procedureAndResultsChildren[i]
    const resultChild = procedureAndResultsChildren[i + 1]

    if (procedureChild && resultChild) {
      result.push({
        procedure: await markdownToHtml(procedureChild.content),
        expectedResult: await markdownToHtml(resultChild.content)
      })
    }
  }

  return result
}

export const normalizeProcedureAndExpectedResults = (
  singleProcedure: string | undefined,
  singleExpectedResult: string | undefined,
  procedureAndExpectedResults: ProcedureAndExpectedResult[] | undefined
): ProcedureAndExpectedResult[] => {
  if (procedureAndExpectedResults && procedureAndExpectedResults.length > 0) {
    return procedureAndExpectedResults
  }

  const procedure = singleProcedure ? singleProcedure : '手順未設定'
  const expectedResult = singleExpectedResult ? singleExpectedResult : '期待される結果未設定'

  return [
    {
      procedure,
      expectedResult
    }
  ]
}

export const generateTestLink = (filename: string): string => {
  return `https://waic.github.io/as_test/WAIC-TEST/HTML/${filename}.html`
}

export const markdownToHtml = async (markdown: string | undefined): Promise<string> => {
  const file = await unified()
    .use(remarkParse) // Markdownをパース
    .use(remarkRehype) // MarkdownのASTをHTMLのASTに変換
    .use(rehypeSanitize) // XSS対策のためHTMLをサニタイズ
    .use(rehypeStringify) // HTMLのASTを文字列に変換
    .process(markdown)

  return file.toString()
}

interface Section {
  title: string
  content: string
  depth: number
  children: Section[]
}

export const extractSections = (fileContent: string): Section[] => {
  // MarkdownをASTにパース
  const ast = unified().use(remarkParse).parse(fileContent) as Root

  const flatSections: Array<{
    title: string
    depth: number
    nodes: RootContent[]
  }> = []

  // headingをtitleにして、それに対応するコンテンツをnodesに配列で入れたものを用意
  for (const node of ast.children) {
    if (node.type === 'heading') {
      const headingNode = node as Heading
      const title = unified()
        .use(remarkStringify)
        .stringify({ type: 'root', children: headingNode.children })
        .toString()
        .trim()

      flatSections.push({
        title,
        depth: headingNode.depth,
        nodes: []
      })
    } else if (flatSections.length > 0) {
      // 今見ている見出しに対してコンテンツを追加
      flatSections[flatSections.length - 1].nodes.push(node)
    }
  }

  // nodesをまとめてstringifyしてcontentに入れる
  const rootSections: Section[] = []
  let lastH1Section: Section | null = null

  for (const section of flatSections) {
    const contentMd = unified()
      .use(remarkStringify)
      .stringify({ type: 'root', children: section.nodes })
      .toString()
      .trim()

    const newSection: Section = {
      title: section.title,
      content: contentMd,
      depth: section.depth,
      children: []
    }

    if (section.depth === 1) {
      // h1の場合はルートに追加
      rootSections.push(newSection)
      lastH1Section = newSection
    } else {
      // h2の場合は最後のh1の子として追加
      if (lastH1Section) {
        lastH1Section.children.push(newSection)
      }
    }
  }

  return rootSections
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
