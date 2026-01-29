import { Check } from 'lucide-react'
import styles from './SatisfiedRadio.module.css'
import { VisuallyHidden } from '../../../components/VisuallyHidden/VisuallyHidden'

export function SatisfiedRadio({
  id,
  isSatisfied,
  onEditIsSatisfied
}: {
  id: string
  isSatisfied: boolean | undefined
  onEditIsSatisfied: (isSatisfied: boolean) => void
}) {
  return (
    <fieldset className={styles.module} role="radiogroup" aria-labelledby={id}>
      <label className={styles.label}>
        <VisuallyHidden>
          <input
            type="radio"
            name="isSatisfied"
            value="satisfied"
            className={styles.input}
            onChange={() => onEditIsSatisfied(true)}
            checked={isSatisfied === true}
          />
        </VisuallyHidden>
        {isSatisfied === true && <Check />}
        <span>満たしている</span>
      </label>
      <label className={styles.label}>
        <VisuallyHidden>
          <input
            type="radio"
            name="isSatisfied"
            value="notSatisfied"
            className={styles.input}
            onChange={() => onEditIsSatisfied(false)}
            checked={isSatisfied === false}
          />
        </VisuallyHidden>
        {isSatisfied === false && <Check />}
        <span>満たしていない</span>
      </label>
    </fieldset>
  )
}
