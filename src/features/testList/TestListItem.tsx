import { useAtomValue } from 'jotai'
import { isCompletedAtom } from '../../states/results'
import { Check } from 'lucide-react'
import { getTestKeyFromId } from '../../functions/testKey'
import { LinkButton } from '../../components/LinkButton/LinkButton'
import styles from './TestListItem.module.css'

export function TestListItem({ testId }: { testId: string }) {
  const isCompleted = useAtomValue(isCompletedAtom)

  const sightCompleted = isCompleted(getTestKeyFromId(testId, 'sight'))
  const soundCompleted = isCompleted(getTestKeyFromId(testId, 'sound'))

  return (
    <li className={styles.module}>
      <div className={styles.titleContainer}>
        <span className={styles.testId}>{testId}</span>
        <span
          className={styles.title}
          title="同じリンクの中に入れた画像 (代替テキストなし) とテキスト (1. 画像 2.
          テキスト)aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        >
          同じリンクの中に入れた画像 (代替テキストなし) とテキスト (1. 画像 2.
          テキスト)aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        </span>
      </div>
      <div className={styles.links}>
        <LinkButton to="/$testId" params={{ testId }} search={{ env: 'sight' }}>
          {sightCompleted && <Check />}
          視覚閲覧環境
        </LinkButton>
        <LinkButton to="/$testId" params={{ testId }} search={{ env: 'sound' }}>
          {soundCompleted && <Check />}
          音声閲覧環境
        </LinkButton>
      </div>
    </li>
  )
}
