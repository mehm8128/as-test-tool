import type { LinkProps } from 'react-router-dom'
import { Link } from 'react-router-dom'
import styles from './LinkButton.module.css'

export function LinkButton({ children, className, ...props }: LinkProps) {
  return (
    <Link {...props} className={className ? `${styles.module} ${className}` : styles.module}>
      {children}
    </Link>
  )
}
