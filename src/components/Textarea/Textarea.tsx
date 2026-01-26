export function Textarea({
  value,
  onChange
}: {
  value: string
  onChange: (value: string) => void
}) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} />
}
