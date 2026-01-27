import { createFileRoute } from '@tanstack/react-router'
import { Setting } from '../features/setting/Setting'
import { useTitle } from '../hooks/useTitle'

export const Route = createFileRoute('/setting')({ component: SettingRoute })

function SettingRoute() {
  useTitle('各種設定 - AS Test Tool')

  return <Setting />
}
