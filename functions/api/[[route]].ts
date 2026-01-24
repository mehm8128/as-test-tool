import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {
  type EnvType,
  extractTestExpectedResult,
  extractTestNotes,
  extractTestProcedure,
  extractTestTitle,
  generateTestLink
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

interface ContentItem {
  type: string
  name: string
}

// ディレクトリ内のファイル一覧を取得
const getDirectoryContents = async (githubToken: string) => {
  return makeGitHubRequest<ContentItem[]>(GITHUB_API_URL, githubToken)
}

interface FileContentResponse {
  content: string
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

    const files = contents
      .filter((item) => item.type === 'file' && item.name.match(/^WAIC-TEST-[0-9-]+.md/))
      .map((item) => item.name)

    return c.json({ tests: files })
  } catch (error) {
    console.error('Error fetching WAIC-TEST directory from GitHub:', error)
    return c.json({ error: 'Failed to fetch WAIC-TEST files from GitHub' }, 500)
  }
})

app.get('/:filename', async (c) => {
  try {
    const filename = c.req.param('filename')
    const env = (c.req.query('env') as EnvType) || 'sight' // デフォルト値を'sight'に設定

    const githubToken = c.env.APP_GITHUB_TOKEN
    if (!githubToken) {
      return c.json({ error: 'GitHub token not configured' }, 500)
    }

    const mdFileName = `${filename}.md`
    const content = await getFileContent(mdFileName, githubToken)

    const title = extractTestTitle(content)
    const procedure = extractTestProcedure(content, env)
    const expectedResult = extractTestExpectedResult(content, env)
    const notes = extractTestNotes(content, env)
    const link = generateTestLink(filename)

    return c.json({
      filename: mdFileName,
      title,
      procedure,
      expectedResult,
      notes,
      link,
      env
    })
  } catch (error) {
    console.error('Error fetching WAIC-TEST file from GitHub:', error)
    return c.json({ error: 'File not found or failed to fetch from GitHub' }, 404)
  }
})

export const onRequest = handle(app)
