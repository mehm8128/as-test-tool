import { exec } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'
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

const execAsync = promisify(exec)
const app = new Hono()

const AS_TEST_DIR = './as-test-repo'
const WAIC_TEST_DIR = join(AS_TEST_DIR, 'WAIC-TEST/HTML')

app.use(
	'*',
	cors({
		origin: 'http://localhost:5173',
		allowMethods: ['GET'],
		allowHeaders: ['Content-Type', 'Authorization']
	})
)

// as_testリポジトリをクローンする関数
const cloneAsTest = async () => {
	try {
		// 既存のディレクトリがあれば削除
		await execAsync(`rm -rf ${AS_TEST_DIR}`)

		// リポジトリをクローン
		console.log('Cloning as_test repository...')
		await execAsync(`git clone https://github.com/waic/as_test ${AS_TEST_DIR}`)
		console.log('as_test repository cloned successfully')
	} catch (error) {
		console.error('Error cloning repository:', error)
	}
}

// APIルート: WAIC-TEST-から始まるmdファイルの一覧を返す
app.get('/api/tests', async c => {
	try {
		const files = await readdir(WAIC_TEST_DIR)
		const waicTestFiles = files.filter(
			file => file.startsWith('WAIC-TEST-') && file.endsWith('.md')
		)
		return c.json({ tests: waicTestFiles })
	} catch (error) {
		console.error('Error reading WAIC-TEST directory:', error)
		return c.json({ error: 'Failed to read WAIC-TEST files' }, 500)
	}
})

// APIルート: 指定されたWAIC-TESTファイルのタイトルを返す
app.get('/api/tests/:filename', async c => {
	try {
		const filename = c.req.param('filename')
		const env = (c.req.query('env') as EnvType) || 'sight' // デフォルト値を'sight'に設定

		const mdFileName = `${filename}.md`
		const filePath = join(WAIC_TEST_DIR, mdFileName)
		const content = await readFile(filePath, 'utf-8')
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
			env // envパラメータをレスポンスに追加
		})
	} catch (error) {
		console.error('Error reading WAIC-TEST file:', error)
		return c.json({ error: 'File not found or failed to read' }, 404)
	}
})

// ヘルスチェック
app.get('/', c => {
	return c.json({ message: 'Server is running!' })
})

const port = 3001
console.log(`Server is running on port ${port}`)

// サーバー起動時にas_testリポジトリをクローン
await cloneAsTest()

serve({
	fetch: app.fetch,
	port
})
