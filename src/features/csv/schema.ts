export interface TestResult {
  date: string
  testNum: string
  env: 'sight' | 'sound'
  operation: string // ここから下3つは将来的に複数になりそう
  result: string
  isSatisfied: boolean | undefined
}

export interface Setting {
  name: string
  email: string
  os: string
  browser: string
  at: string
  atSetting: string
}
