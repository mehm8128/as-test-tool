import { Link } from '@tanstack/react-router'
import { atom, useAtom, useAtomValue } from 'jotai'
import { atomFamily } from 'jotai-family'
import { getApiBaseUrl } from '../../utils/api'
import { testResultsAtomFamily } from '../csv/state'
import { Circle, X } from 'lucide-react'

export interface TestDetail {
  filename: string
  title: string
  procedure: string
  expectedResult: string
  notes: string
  link: string
  env?: string
}

const testTitleAtomFamily = atomFamily((key: string) =>
  atom(async () => {
    const [filename, env] = key.split('|')
    const baseUrl = getApiBaseUrl()
    let url = `${baseUrl}/api/${filename}`
    if (env) {
      url += `?env=${env}`
    }
    const response = await fetch(url)
    return (await response.json()) as TestDetail
  })
)

export function TestDetail({ filename, env = 'sight' }: { filename: string; env?: string }) {
  const atomKey = `${filename}|${env}`
  const testData = useAtomValue(testTitleAtomFamily(atomKey))

  const [testResult, setTestResult] = useAtom(testResultsAtomFamily(atomKey))

  const handleEditTestResult = (updatedResult: Partial<typeof testResult>) => {
    const dateParts = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).formatToParts(new Date())
    const dateString = dateParts
      .filter(({ type }) => type !== 'literal')
      .map(({ value }) => value)
      .join('-')

    setTestResult((prev) => ({
      ...prev,
      ...updatedResult,
      date: dateString // TODO: testResultsAtomFamilyのset時にできるとベスト
    }))
  }

  return (
    <div>
      <Link to="/">← Back</Link>
      <h1>{testData.filename}</h1>
      <div>
        <h2>タイトル</h2>
        <p>{testData.title}</p>
        <h2>テスト方法</h2>
        <h3>手順</h3>
        <p>{testData.procedure}</p>
        <h3>注意事項</h3>
        <p>{testData.notes}</p>
        <label>
          <span>行った操作</span>
          <textarea
            value={testResult.operation}
            onChange={(e) =>
              handleEditTestResult({
                ...testResult,
                operation: e.target.value
              })
            }
          />
        </label>
        <h2>期待される結果</h2>
        <p>{testData.expectedResult}</p>
        <label>
          <span>操作の結果</span>
          <textarea
            value={testResult.result}
            onChange={(e) =>
              handleEditTestResult({
                ...testResult,
                result: e.target.value
              })
            }
          />
        </label>
        <div>
          <button
            type="button"
            onClick={() =>
              handleEditTestResult({
                ...testResult,
                isSatisfied: true
              })
            }
          >
            <Circle />
            満たしている
          </button>
          <button
            type="button"
            onClick={() =>
              handleEditTestResult({
                ...testResult,
                isSatisfied: false
              })
            }
          >
            <X />
            満たしていない
          </button>
        </div>
        <h2>リンク</h2>
        <p>
          <a href={testData.link} target="_blank" rel="noopener noreferrer">
            {testData.link}
          </a>
        </p>
      </div>
    </div>
  )
}
