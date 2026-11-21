import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/Login"
import DashboardLayout from "./components/DashboardLayout"
import { Dashboard } from "./pages/Dashboard"
import Customers from "./pages/Customers"
import Loans from "./pages/Loans"
import Collaterals from "./pages/Collaterals"
import Guarantors from "./pages/Guarantors"
import Invoices from "./pages/Invoices"
import Disbursements from "./pages/Disbursements"
import Users from "./pages/Users"
import Settings from "./pages/Settings"

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="loans" element={<Loans />} />
            <Route path="collaterals" element={<Collaterals />} />
            <Route path="guarantors" element={<Guarantors />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="disbursements" element={<Disbursements />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
