import { useId } from 'react'
import { Heading } from '../../../components/Heading/Heading'
import { Label } from '../../../components/Label/Label'
import { MarkdownContent } from '../../../components/MarkdownContent/MarkdownContent'
import { Textarea } from '../../../components/Textarea/Textarea'
import type { TestResult } from '../../../states/results'
import { type TestDetail } from '../../../states/testDetail'
import { SatisfiedRadio } from './SatisfiedRadio'
import styles from './TestForm.module.css'

export function TestForm({
  testData,
  formState,
  onEditTestResult
}: {
  testData: TestDetail
  formState: TestResult
  onEditTestResult: (formState: TestResult) => void
}) {
  const satisfiedRadioFieldId = useId()

  return testData.proceduresAndExpectedResults.map((procedureAndExpectedResult, index) => (
    <div key={index} className={styles.testProcedure}>
      <section className={styles.section}>
        <div className={styles.innerSection}>
          <Heading level={3}>手順 {index + 1}</Heading>
          <MarkdownContent html={procedureAndExpectedResult.procedure} />
        </div>
        <Label labelText={`行った操作 ${index + 1}`}>
          <Textarea
            value={formState.operationAndResults[index].operation}
            onChange={(value) =>
              onEditTestResult({
                ...formState,
                operationAndResults: formState.operationAndResults.map((o, i) =>
                  i === index ? { ...o, operation: value } : o
                )
              })
            }
          />
        </Label>
      </section>
      <section className={styles.section}>
        <div className={styles.innerSection}>
          <Heading level={3}>期待される結果 {index + 1}</Heading>
          <MarkdownContent html={procedureAndExpectedResult.expectedResult} />
        </div>
        <Label labelText={`操作の結果 ${index + 1}`}>
          <Textarea
            value={formState.operationAndResults[index].result}
            onChange={(value) =>
              onEditTestResult({
                ...formState,
                operationAndResults: formState.operationAndResults.map((o, i) =>
                  i === index ? { ...o, result: value } : o
                )
              })
            }
          />
        </Label>
      </section>
      <section className={styles.innerSection}>
        <Heading level={3} id={satisfiedRadioFieldId}>
          期待される結果 {index + 1}を満たしているかどうか
        </Heading>
        <SatisfiedRadio
          id={satisfiedRadioFieldId}
          isSatisfied={formState.operationAndResults[index].isSatisfied}
          onEditIsSatisfied={(isSatisfied) =>
            onEditTestResult({
              ...formState,
              operationAndResults: formState.operationAndResults.map((o, i) =>
                i === index ? { ...o, isSatisfied } : o
              )
            })
          }
        />
      </section>
    </div>
  ))
}
