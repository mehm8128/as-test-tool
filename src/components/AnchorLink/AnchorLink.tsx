import { createLink } from '@tanstack/react-router'
import { ExternalLink as ExternalLinkIcon } from 'lucide-react'
import type { ComponentProps, ReactNode, Ref } from 'react'
import styles from './AnchorLink.module.css'

export function AnchorLinkInner({
  ref,
  ...props
}: {
  ref: Ref<HTMLAnchorElement>
} & ComponentProps<'a'>) {
  return (
    <a ref={ref} {...props} className={styles.module}>
      {props.children}
    </a>
  )
}

export const AnchorLink = createLink(AnchorLinkInner)

export function ExternalAnchorLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={styles.module}>
      {children}
      <ExternalLinkIcon />
    </a>
  )
}
