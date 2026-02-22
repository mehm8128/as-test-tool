import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import type { TestResult } from '../../../states/results'
import type { TestDetail } from '../../../states/testDetail'
import { TestForm } from './TestForm'

test('各フィールドに入力した情報でstateがアップデートされる', async () => {
  // Arrange
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
  const onChange = vi.fn()
  const Wrapper = ({ onChange }: { onChange: (value: Partial<TestResult>) => void }) => {
    const [formState, setFormState] = useState<TestResult>({
      date: '2026-01-01',
      testId: 'WAIC-TEST-0001-01',
      env: 'sight',
      operationAndResults: [
        {
          operation: '',
          result: '',
          isSatisfied: undefined
        }
      ]
    })

    const handleChange = (value: Partial<TestResult>) => {
      setFormState((prev) => ({ ...prev, ...value }))
      onChange(value)
    }

    return (
      <TestForm testData={testData} formState={formState} handleEditTestResult={handleChange} />
    )
  }
  const screen = await render(
    <BrowserRouter>
      <Wrapper onChange={onChange} />
    </BrowserRouter>
  )

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
  expect(onChange).toHaveBeenCalledWith({
    date: '2026-01-01',
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
})
