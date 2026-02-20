import { Navigate } from 'react-router-dom'

export function NotFoundRoute() {
  return <Navigate to="/" replace />
}
