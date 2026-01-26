import { createLink } from '@tanstack/react-router'
import type { ComponentProps, Ref } from 'react'
import styles from './LinkButton.module.css'

export function LinkButtonInner({
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

export const LinkButton = createLink(LinkButtonInner)
