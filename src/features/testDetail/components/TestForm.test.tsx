import { BrowserRouter } from 'react-router-dom'
import { afterEach, expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import type { TestDetail } from '../../../states/testDetail'
import { useForm } from '../hooks/useForm'
import { TestForm } from './TestForm'

afterEach(() => {
  vi.useRealTimers()
})

test('各フィールドに入力した情報でstateがアップデートされる', async () => {
  // Arrange
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 0, 1, 12, 0, 0))

  const testKey = 'WAIC-TEST-0001-01|sight'
  const testData: TestDetail = {
    filename: 'WAIC-TEST-0001-01',
    env: 'sight',
    title: 'テスト1',
    notes: '特になし',
    proceduresAndExpectedResults: [
      {
        procedure: '手順1の内容',
        expectedResult: '期待される結果1の内容'
      }
    ],
    link: 'https://example.com',
    testCodeLink: 'https://example.com/test-code'
  }
  const Wrapper = () => {
    const { formState, handleEditTestResult } = useForm(testKey, testData)
    return (
      <BrowserRouter>
        <TestForm
          testData={testData}
          formState={formState}
          onEditTestResult={handleEditTestResult}
        />
      </BrowserRouter>
    )
  }
  const screen = await render(<Wrapper />)

  const operationTextarea = screen.getByRole('textbox', { name: '行った操作 1' })
  const resultTextarea = screen.getByRole('textbox', { name: '操作の結果 1' })
  const isSatisfiedRadioGroup = screen.getByRole('radiogroup', {
    name: '期待される結果 1を満たしているかどうか'
  })
  // radioはvisually hiddenなので、代わりにgetByTextで取得する
  const isSatisfiedRadio = isSatisfiedRadioGroup.getByText('満たしている')

  // Act
  await userEvent.fill(operationTextarea, '操作1')
  await userEvent.fill(resultTextarea, '結果1')
  await userEvent.click(isSatisfiedRadio)

  // Assert
  const localStorageValue = localStorage.getItem(`waic-test-result-${testKey}`)
  expect(localStorageValue).toBe(
    JSON.stringify({
      date: '2026-1-1',
      testId: 'WAIC-TEST-0001-01',
      env: 'sight',
      operationAndResults: [
        {
          operation: '操作1',
          result: '結果1',
          isSatisfied: true
        }
      ]
    })
  )
})
