export function InputText({
  type = 'text',
  value,
  onChange
}: {
  type?: 'text' | 'email'
  value: string
  onChange: (value: string) => void
}) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
}
