import { exec } from 'node:child_process'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const execAsync = promisify(exec)
const app = new Hono()

const AS_TEST_DIR = './as-test-repo'
const WAIC_TEST_DIR = join(AS_TEST_DIR, 'WAIC-TEST/HTML')

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

// markdownファイルから「# テストのタイトル」の次の行を抽出
const extractTestTitle = (content: string): string => {
	const titleMatch = content.match(/^#\s*テストのタイトル\s*\n\n(.*)$/m)
	return titleMatch ? titleMatch[1].trim() : 'Untitled'
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

		// WAIC-TEST-プレフィックスと.md拡張子の確認・追加
		let mdFileName = filename
		if (!mdFileName.startsWith('WAIC-TEST-')) {
			mdFileName = `WAIC-TEST-${mdFileName}`
		}
		if (!mdFileName.endsWith('.md')) {
			mdFileName = `${mdFileName}.md`
		}

		const filePath = join(WAIC_TEST_DIR, mdFileName)
		const content = await readFile(filePath, 'utf-8')
		const title = extractTestTitle(content)

		return c.json({ filename: mdFileName, title })
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
