import { expect, test } from 'vitest'
import { render, renderHook } from 'vitest-browser-react'
import { Setting } from './Setting'
import { useAtom } from 'jotai'
import { settingAtom } from '../../states/setting'
import { BrowserRouter } from 'react-router-dom'
import { userEvent } from 'vitest/browser'

test('各フィールドに入力した情報がatomに保存される', async () => {
  // Arrange
  const screen = await render(
    <BrowserRouter>
      <Setting />
    </BrowserRouter>
  )
  const { result } = await renderHook(() => useAtom(settingAtom))

  const nameInput = screen.getByLabelText('氏名')
  const emailInput = screen.getByLabelText('メールアドレス')
  const osInput = screen.getByLabelText('OS')
  const browserInput = screen.getByLabelText('ブラウザ')
  const atInput = screen.getByLabelText('支援技術')
  const atSettingTextarea = screen.getByLabelText('支援技術に対する追加の設定')

  // Act
  await userEvent.fill(nameInput, 'taro yamada')
  await userEvent.fill(emailInput, 'taro@example.com')
  await userEvent.fill(osInput, 'Windows')
  await userEvent.fill(browserInput, 'Chrome')
  await userEvent.fill(atInput, 'NVDA')
  await userEvent.fill(atSettingTextarea, 'no setting')

  // Assert
  expect(result.current[0]).toEqual({
    name: 'taro yamada',
    email: 'taro@example.com',
    os: 'Windows',
    browser: 'Chrome',
    at: 'NVDA',
    atSetting: 'no setting'
  })
})
