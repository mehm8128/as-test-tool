import type { ReactNode } from 'react'

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
    <button type="button" onClick={onClick}>
      {icon}
      {children}
    </button>
  )
}
