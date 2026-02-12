import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { cache } from 'hono/cache'
import {
  type EnvType,
  extractNotesContent,
  extractProcedureAndExpectedResultsContent,
  extractProceduresContent,
  extractResultsContent,
  extractSections,
  extractTestCodeLink,
  extractTests,
  extractTitleContent,
  generateTestLink,
  normalizeProcedureAndExpectedResults,
  type ProcedureAndExpectedResult
} from '../_utils'
import { handle } from 'hono/cloudflare-pages'

interface Env {
  APP_GITHUB_TOKEN: string
}

const app = new Hono<{ Bindings: Env }>().basePath('/api')

const GITHUB_API_URL = 'https://api.github.com/repos/waic/as_test/contents/WAIC-TEST/HTML' as const

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET'],
    allowHeaders: ['Content-Type', 'Authorization']
  }),
  cache({
    cacheName: 'api-cache',
    cacheControl: 'max-age=3600'
  })
)

// GitHub APIリクエスト用のヘルパー関数
const makeGitHubRequest = async <T>(url: string, githubToken: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'User-Agent': 'WAIC-AS-Test-Tool/1.0'
    }
  })

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as T
}

interface FileContentResponse {
  content: string
}

// ディレクトリ内のファイル一覧を取得
const getDirectoryContents = async (githubToken: string) => {
  const response = await makeGitHubRequest<FileContentResponse>(
    `${GITHUB_API_URL}/README.md`,
    githubToken
  )

  if (response.content) {
    // base64をデコード
    const content = new TextDecoder().decode(
      Uint8Array.from(atob(response.content), (c) => c.charCodeAt(0))
    )
    return content
  }

  throw new Error('File content not found')
}

// ファイルの内容を取得
const getFileContent = async (filename: string, githubToken: string) => {
  const response = await makeGitHubRequest<FileContentResponse>(
    `${GITHUB_API_URL}/${filename}`,
    githubToken
  )

  if (response.content) {
    // base64をデコード
    const content = new TextDecoder().decode(
      Uint8Array.from(atob(response.content), (c) => c.charCodeAt(0))
    )
    return content
  }

  throw new Error('File content not found')
}

app.get('/', async (c) => {
  try {
    const githubToken = c.env.APP_GITHUB_TOKEN
    if (!githubToken) {
      return c.json({ error: 'GitHub token not configured' }, 500)
    }

    const contents = await getDirectoryContents(githubToken)

    const tests = extractTests(contents)

    return c.json({ tests })
  } catch (error) {
    console.error('Error fetching WAIC-TEST directory from GitHub:', error)
    return c.json({ error: 'Failed to fetch WAIC-TEST files from GitHub' }, 500)
  }
})

interface TestDetailResponse {
  filename: string
  env: EnvType
  title: string
  notes: string
  proceduresAndExpectedResults: ProcedureAndExpectedResult[]
  link: string
  testCodeLink: string
}

app.get('/:testId', async (c) => {
  try {
    const testId = c.req.param('testId')
    const env = (c.req.query('env') as EnvType) || 'sight' // デフォルト値を'sight'に設定

    const githubToken = c.env.APP_GITHUB_TOKEN
    if (!githubToken) {
      return c.json({ error: 'GitHub token not configured' }, 500)
    }

    const mdFileName = `WAIC-TEST-${testId}`
    const content = await getFileContent(`${mdFileName}.md`, githubToken)

    const sections = extractSections(content)
    const sectionsObj = {
      title: extractTitleContent(sections),
      notes: await extractNotesContent(sections, env),
      procedures: await extractProceduresContent(sections, env),
      expectedResults: await extractResultsContent(sections, env),
      proceduresAndExpectedResults: normalizeProcedureAndExpectedResults(
        await extractProceduresContent(sections, env),
        await extractResultsContent(sections, env),
        await extractProcedureAndExpectedResultsContent(sections, env)
      ),
      link: generateTestLink(mdFileName),
      testCodeLink: extractTestCodeLink(sections)
    }

    return c.json({
      filename: mdFileName,
      env,
      ...sectionsObj
    } satisfies TestDetailResponse)
  } catch (error) {
    console.error('Error fetching WAIC-TEST file from GitHub:', error)
    return c.json({ error: 'File not found or failed to fetch from GitHub' }, 404)
  }
})

export const onRequest = handle(app)
