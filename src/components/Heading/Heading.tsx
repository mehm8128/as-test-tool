import type { ReactNode } from 'react'
import styles from './Heading.module.css'

export function Heading({
  level,
  children,
  id
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  id?: string
}) {
  const Tag = `h${level}` as const
  return (
    <Tag id={id} className={styles.module}>
      {children}
    </Tag>
  )
}
