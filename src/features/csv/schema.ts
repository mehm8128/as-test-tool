export interface TestResult {
	testNum: string
	env: 'sight' | 'sound'
	operation: string // ここから下3つは将来的に複数になりそう
	result: string
	isSatisfied: boolean
}

export interface Setting {
	name: string
	email: string
	os: string
	browser: string
	at: string
	asSetting: string
}
