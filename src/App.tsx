import { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import styles from './App.module.css'
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary'
import { IndexRoute } from './routes/IndexRoute'
import { NotFoundRoute } from './routes/NotFoundRoute'
import { SettingRoute } from './routes/SettingRoute'
import { TestDetailRoute } from './routes/TestDetailRoute'

function App() {
  return (
    <main className={styles.module}>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<IndexRoute />} />
            <Route path="/setting" element={<SettingRoute />} />
            <Route path="/:testId" element={<TestDetailRoute />} />
            <Route path="*" element={<NotFoundRoute />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}

export default App
