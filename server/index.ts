import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {
  type EnvType,
  extractTestExpectedResult,
  extractTestNotes,
  extractTestProcedure,
  extractTestTitle,
  generateTestLink
} from './extractor'

const app = new Hono()

const GITHUB_API_URL = 'https://api.github.com/repos/waic/as_test/contents/WAIC-TEST/HTML' as const

const APP_GITHUB_TOKEN = process.env.APP_GITHUB_TOKEN
if (!APP_GITHUB_TOKEN) {
  console.warn(
    'GITHUB_TOKEN environment variable is not set. GitHub API requests will be rate limited.'
  )
}

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET'],
    allowHeaders: ['Content-Type', 'Authorization']
  })
)

// GitHub APIリクエスト用のヘルパー関数
const makeGitHubRequest = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${APP_GITHUB_TOKEN}`
    }
  })

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

// ディレクトリ内のファイル一覧を取得
const getDirectoryContents = async () => {
  return makeGitHubRequest(GITHUB_API_URL)
}

// ファイルの内容を取得
const getFileContent = async (filename: string) => {
  const response = await makeGitHubRequest(`${GITHUB_API_URL}/${filename}`)

  if (response.content) {
    const content = Buffer.from(response.content, 'base64').toString('utf-8')
    return content
  }

  throw new Error('File content not found')
}

interface ContentItem {
  type: string
  name: string
}

app.get('/api/tests', async (c) => {
  try {
    const contents: ContentItem[] = await getDirectoryContents()

    const files = contents
      .filter((item) => item.type === 'file' && item.name.match(/^WAIC-TEST-[0-9-]+.md/))
      .map((item) => item.name)

    return c.json({ tests: files })
  } catch (error) {
    console.error('Error fetching WAIC-TEST directory from GitHub:', error)
    return c.json({ error: 'Failed to fetch WAIC-TEST files from GitHub' }, 500)
  }
})

app.get('/api/tests/:filename', async (c) => {
  try {
    const filename = c.req.param('filename')
    const env = (c.req.query('env') as EnvType) || 'sight' // デフォルト値を'sight'に設定

    const mdFileName = `${filename}.md`
    const content = await getFileContent(mdFileName)

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

// ヘルスチェック
app.get('/', (c) => {
  return c.json({ message: 'Server is running!' })
})

const port = 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
