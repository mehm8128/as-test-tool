import { Setting } from '../features/setting/Setting'
import { useTitle } from '../hooks/useTitle'

export function SettingRoute() {
  useTitle('各種設定 - AS Test Tool')

  return <Setting />
}
