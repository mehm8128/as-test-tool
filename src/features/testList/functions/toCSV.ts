export const toCsv = (tests: string[]) => {
	const csvContent =
		'data:text/csv;charset=utf-8,' +
		tests // TODO: localstorageから取るようにする
			.map(test => {
				const filename = test.replace(/\.md$/, '')
				const sightLink = `http://localhost:3000/${filename}?env=sight`
				const soundLink = `http://localhost:3000/${filename}?env=sound`
				return `${test},${sightLink},${soundLink}`
			})
			.join('\n')
	const encodedUri = encodeURI(csvContent)
	const link = document.createElement('a')
	link.setAttribute('href', encodedUri)
	link.setAttribute('download', 'waic_as_test_result.csv')
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
