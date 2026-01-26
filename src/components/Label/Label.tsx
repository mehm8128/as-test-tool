import type { ReactNode } from 'react'

export function Label({ children }: { children: ReactNode }) {
  return <label>{children}</label>
}
