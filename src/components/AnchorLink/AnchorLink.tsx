import { ExternalLink as ExternalLinkIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import styles from './AnchorLink.module.css'

export function AnchorLink({ children, className, ...props }: LinkProps) {
  return (
    <Link {...props} className={className ? `${styles.module} ${className}` : styles.module}>
      {children}
    </Link>
  )
}

export function ExternalAnchorLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={styles.module}>
      {children}
      <ExternalLinkIcon size="1em" aria-label="別タブで開く" />
    </a>
  )
}
