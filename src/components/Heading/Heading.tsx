import type { ReactNode } from 'react'

export function Heading({
  level,
  children
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
}) {
  const Tag = `h${level}` as const
  return <Tag>{children}</Tag>
}
