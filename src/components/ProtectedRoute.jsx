import { BarLoader } from "react-spinners"
import { useAuth } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div>
    <BarLoader color="#00BFFF" size={150} />
  </div>
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}

export default ProtectedRoute