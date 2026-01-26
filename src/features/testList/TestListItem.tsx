import { useAtomValue } from 'jotai'
import { isCompletedAtom } from '../../states/results'
import { Check } from 'lucide-react'
import { getTestKeyFromId } from '../../functions/testKey'
import { AnchorLink } from '../../components/Link/Link'

export function TestListItem({ testId }: { testId: string }) {
  const isCompleted = useAtomValue(isCompletedAtom)

  const sightCompleted = isCompleted(getTestKeyFromId(testId, 'sight'))
  const soundCompleted = isCompleted(getTestKeyFromId(testId, 'sound'))

  return (
    <li>
      <div>{testId}</div>
      {/**TODO: タイトルを取りたい */}
      <div>
        <AnchorLink to="/$testId" params={{ testId }} search={{ env: 'sight' }}>
          {sightCompleted && <Check />}
          視覚閲覧環境
        </AnchorLink>
        <AnchorLink to="/$testId" params={{ testId }} search={{ env: 'sound' }}>
          {soundCompleted && <Check />}
          音声閲覧環境
        </AnchorLink>
      </div>
    </li>
  )
}
