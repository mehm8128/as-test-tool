import { Link } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { isCompletedAtom } from '../csv/state'
import { Check } from 'lucide-react'

export function TestListItem({ test }: { test: string }) {
  const isCompleted = useAtomValue(isCompletedAtom)

  const sightCompleted = isCompleted(`${test}|sight`)
  const soundCompleted = isCompleted(`${test}|sound`)
  return (
    <li>
      <div>{test}</div>
      {/**TODO: タイトルを取りたい */}
      <div>
        <Link to="/$testId" params={{ testId: test }} search={{ env: 'sight' }}>
          {sightCompleted && <Check />}
          視覚閲覧環境
        </Link>
        <Link to="/$testId" params={{ testId: test }} search={{ env: 'sound' }}>
          {soundCompleted && <Check />}
          音声閲覧環境
        </Link>
      </div>
    </li>
  )
}
