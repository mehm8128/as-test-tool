import { useAtomValue } from 'jotai'
import { isCompletedAtom } from '../../states/results'
import { Check } from 'lucide-react'
import { getTestKeyFromId } from '../../functions/testKey'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import styles from './TestListItem.module.css'

export function TestListItem({ testId, testTitle }: { testId: string; testTitle: string }) {
  const isCompleted = useAtomValue(isCompletedAtom)

  const sightCompleted = isCompleted(getTestKeyFromId(testId, 'sight'))
  const soundCompleted = isCompleted(getTestKeyFromId(testId, 'sound'))

  return (
    <li className={styles.module}>
      <div className={styles.titleContainer}>
        <span className={styles.testId}>{testId}</span>
        <span className={styles.title} title={testTitle}>
          {testTitle}
        </span>
      </div>
      <div className={styles.links}>
        <LinkButton to="/$testId" params={{ testId }} search={{ env: 'sight' }}>
          {sightCompleted && <Check aria-label="完了済み" />}
          視覚閲覧環境
        </LinkButton>
        <LinkButton to="/$testId" params={{ testId }} search={{ env: 'sound' }}>
          {soundCompleted && <Check aria-label="完了済み" />}
          音声閲覧環境
        </LinkButton>
      </div>
    </li>
  )
}
