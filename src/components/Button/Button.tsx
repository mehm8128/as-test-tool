import type { ReactNode } from 'react'
import styles from './Button.module.css'

export function Button({
  children,
  icon,
  onClick
}: {
  children: ReactNode
  icon?: ReactNode
  onClick?: () => void
}) {
  return (
    <button type="button" onClick={onClick} className={styles.module}>
      {icon}
      {children}
    </button>
  )
}
