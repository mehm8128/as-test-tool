import { expect, test } from 'vitest'
import { render, renderHook } from 'vitest-browser-react'
import { Setting } from './Setting'
import { useAtom } from 'jotai'
import { settingAtom } from '../../states/setting'

test('各フィールドに入力しlocalStorageに保存される', async () => {
  // Arrange
  const screen = await render(<Setting />)
  const { result } = await renderHook(() => useAtom(settingAtom))

  const nameInput = screen.getByLabelText('氏名')
  const emailInput = screen.getByLabelText('メールアドレス')
  const osInput = screen.getByLabelText('OS')
  const browserInput = screen.getByLabelText('ブラウザ')
  const atInput = screen.getByLabelText('支援技術')
  const atSettingTextarea = screen.getByLabelText('支援技術に対する追加の設定')

  // Act
  await nameInput.fill('taro yamada')
  await emailInput.fill('taro@example.com')
  await osInput.fill('Windows')
  await browserInput.fill('Chrome')
  await atInput.fill('NVDA')
  await atSettingTextarea.fill('no setting')

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
