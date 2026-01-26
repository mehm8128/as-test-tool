import type { ReactNode } from 'react'
import styles from './Label.module.css'

export function Label({ children, labelText }: { children: ReactNode; labelText: string }) {
  return (
    <label className={styles.module}>
      <span className={styles.labelText}>{labelText}</span>
      {children}
    </label>
  )
}
