import styles from './InputText.module.css'

export function InputText({
  type = 'text',
  value,
  full,
  onChange
}: {
  type?: 'text' | 'email' | 'search'
  value: string
  full?: boolean
  onChange: (value: string) => void
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${styles.module} ${full ? styles.full : ''}`}
    />
  )
}
