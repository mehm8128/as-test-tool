import { Link } from '@tanstack/react-router'
import { atom, useAtomValue } from 'jotai'
import { toCsv } from '../csv/functions/toCSV'
import { isEditedAtom, settingAtom, testResultsAtom } from '../csv/state'

export const testsAtom = atom(async () => {
  const response = await fetch('http://localhost:3001/api/tests')
  const data = await response.json()
  return data.tests as string[]
})

export function TestList() {
  const tests = useAtomValue(testsAtom)
  const testResults = useAtomValue(testResultsAtom)
  const setting = useAtomValue(settingAtom)
  const isEdited = useAtomValue(isEditedAtom)

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
                    視覚（{isEdited(`${filename}|sight`) ? '編集済み' : '未編集'}）
                  </Link>
                </li>
                <li>
                  <Link to="/$filename" params={{ filename }} search={{ env: 'sound' }}>
                    音声（{isEdited(`${filename}|sound`) ? '編集済み' : '未編集'}）
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
