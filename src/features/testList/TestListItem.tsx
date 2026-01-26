import { Link } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { isCompletedAtom } from '../../states/results'
import { Check } from 'lucide-react'
import { getTestKeyFromId } from '../../functions/testKey'

export function TestListItem({ testId }: { testId: string }) {
  const isCompleted = useAtomValue(isCompletedAtom)

  const sightCompleted = isCompleted(getTestKeyFromId(testId, 'sight'))
  const soundCompleted = isCompleted(getTestKeyFromId(testId, 'sound'))

  return (
    <li>
      <div>{testId}</div>
      {/**TODO: タイトルを取りたい */}
      <div>
        <Link to="/$testId" params={{ testId }} search={{ env: 'sight' }}>
          {sightCompleted && <Check />}
          視覚閲覧環境
        </Link>
        <Link to="/$testId" params={{ testId }} search={{ env: 'sound' }}>
          {soundCompleted && <Check />}
          音声閲覧環境
        </Link>
      </div>
    </li>
  )
}
