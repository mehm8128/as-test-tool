import type { ReactNode } from 'react'
import styles from './Button.module.css'

export function Button({
  children,
  icon,
  onClick,
  ariaPressed
}: {
  children: ReactNode
  icon?: ReactNode
  onClick?: () => void
  ariaPressed?: boolean
}) {
  return (
    <button type="button" onClick={onClick} className={styles.module} aria-pressed={ariaPressed}>
      {icon}
      {children}
    </button>
  )
}
