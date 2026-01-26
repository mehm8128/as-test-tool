import styles from './Textarea.module.css'

export function Textarea({
  value,
  onChange
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} className={styles.module} />
  )
}
