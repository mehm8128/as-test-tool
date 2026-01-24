import { Link } from '@tanstack/react-router'
import { atom, useAtomValue } from 'jotai'
import { getApiBaseUrl } from '../../utils/api'
import { toCsv } from '../csv/functions/toCSV'
import { isJudgedAtom, settingAtom, testResultsAtom } from '../csv/state'

export const testsAtom = atom(async () => {
  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}/api`)
  const data = await response.json()
  return data.tests as string[]
})

export function TestList() {
  const tests = useAtomValue(testsAtom)
  const testResults = useAtomValue(testResultsAtom)
  const setting = useAtomValue(settingAtom)
  const isJudged = useAtomValue(isJudgedAtom)

  return (
    <div>
      <h1>WAIC Test 一覧</h1>
      <button onClick={() => toCsv(testResults, setting)} type="button">
        to csv
      </button>
      <ul>
        {tests.map((test: string) => {
          const filename = test.replace(/\.md$/, '')
          return (
            <li key={test}>
              <span>{test}</span>
              <ul>
                <li>
                  <Link to="/$filename" params={{ filename }} search={{ env: 'sight' }}>
                    視覚（{isJudged(`${filename}|sight`) ? '判定済み' : '未判定'}）
                  </Link>
                </li>
                <li>
                  <Link to="/$filename" params={{ filename }} search={{ env: 'sound' }}>
                    音声（{isJudged(`${filename}|sound`) ? '判定済み' : '未判定'}）
                  </Link>
                </li>
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
