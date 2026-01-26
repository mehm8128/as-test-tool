import { createFileRoute } from '@tanstack/react-router'
import { Setting } from '../features/setting/Setting'

export const Route = createFileRoute('/setting')({ component: SettingRoute })

function SettingRoute() {
  return (
    <>
      <title>各種設定 - AS Test Tool</title>
      <Setting />
    </>
  )
}
