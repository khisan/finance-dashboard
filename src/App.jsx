import { Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
