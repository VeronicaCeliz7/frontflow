import './App.css'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import LoginScreen from './components/LoginScreen'
import SignUpScreen from './components/SignUpScreen'
import HomeScreen from './components/HomeScreen'
import CrearReporteScreen from './components/CrearReporteScreen'
import MisReportesScreen from './components/MisReportesScreen'
import DetalleReporteScreen from './components/DetalleReporteScreen'
import AdminDashboard from './features/municipality/pages/AdminDashboard'
import OperatorDashboard from './features/municipality/pages/OperatorDashboard'
import SuperDashboard from './components/super/SuperDashboard'
import ProfileScreen from './components/ProfileScreen' // ✅ NUEVO IMPORT
import { ThemeProvider } from './context/ThemeContext'
import { ThemeToggle } from './components/ThemeToggle'
import { Building2, HardHat, Crown, User } from 'lucide-react'

// ============================================
// PageWrapper - DEFINIDO ANTES DE USARLO
// ============================================
function PageWrapper({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  const { user } = useUser()
  const navigate = useNavigate()

  const role = user?.publicMetadata?.role as string | undefined
  const roles = (user?.publicMetadata?.roles as string[]) || []

  const isSuperAdmin = role === 'superadmin' || roles.includes('superadmin')
  const isAdmin = role === 'admin' || roles.includes('admin')
  const isOperator = role === 'operator' || role === 'operador' || roles.includes('operator') || roles.includes('operador')

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <header className="fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex gap-2">
            {(isAdmin || isSuperAdmin) && (
              <button onClick={() => navigate('/municipality/admin')} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5">
                <Building2 size={14} />
                Administrador
              </button>
            )}
            {(isOperator || isSuperAdmin) && (
              <button onClick={() => navigate('/municipality/operator')} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5">
                <HardHat size={14} />
                Operador
              </button>
            )}
            {isSuperAdmin && (
              <button onClick={() => navigate('/superadmin')} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5">
                <Crown size={14} />
                Superadministrador
              </button>
            )}
            {(isAdmin || isOperator || isSuperAdmin) && (
              <button onClick={() => navigate('/')} className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5">
                <User size={14} />
                Ciudadano
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <div className={`px-4 sm:px-6 lg:px-8 mx-auto ${wide ? 'max-w-6xl' : 'max-w-md'}`}>
          {children}
        </div>
      </main>
    </div>
  )
}

// ============================================
// RoleRouter - CORREGIDO
// ============================================
function RoleRouter() {
  const { user, isLoaded } = useUser()
  const location = useLocation()

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  const role = user?.publicMetadata?.role as string | undefined

  const isSuperAdmin = role === 'superadmin'
  const isAdmin = role === 'admin'
  const isOperator = role === 'operator' || role === 'operador'

  // Rutas que TODOS los usuarios pueden visitar (modo ciudadano)
  const rutasCiudadano = ['/', '/nuevo-reporte', '/mis-reportes', '/reporte', '/profile'] // ✅ AGREGADO /profile
  const esRutaCiudadano = rutasCiudadano.some(ruta => location.pathname.startsWith(ruta))

  // Si está en una ruta de ciudadano, dejar pasar (sin redirigir)
  if (esRutaCiudadano) {
    return <HomeScreen />
  }

  // Si NO está en ruta de ciudadano, redirigir según su rol
  if (isSuperAdmin) {
    return <Navigate to="/superadmin" replace />
  }

  if (isAdmin) {
    return <Navigate to="/municipality/admin" replace />
  }

  if (isOperator) {
    return <Navigate to="/municipality/operator" replace />
  }

  // Si no tiene rol específico, es ciudadano normal
  return <HomeScreen />
}

// ============================================
// ProtectedRoute
// ============================================
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><Navigate to="/login" replace /></SignedOut>
    </>
  )
}

// ============================================
// App
// ============================================
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/login" element={
            <PageWrapper>
              <SignedOut><LoginScreen /></SignedOut>
              <SignedIn><RoleRouter /></SignedIn>
            </PageWrapper>
          } />

          <Route path="/sign-up" element={
            <PageWrapper>
              <SignedOut><SignUpScreen /></SignedOut>
              <SignedIn><RoleRouter /></SignedIn>
            </PageWrapper>
          } />

          <Route path="/" element={
            <PageWrapper>
              <SignedOut><LoginScreen /></SignedOut>
              <SignedIn><RoleRouter /></SignedIn>
            </PageWrapper>
          } />

          <Route path="/nuevo-reporte" element={
            <PageWrapper wide>
              <ProtectedRoute>
                <CrearReporteScreen />
              </ProtectedRoute>
            </PageWrapper>
          } />

          <Route path="/mis-reportes" element={
            <PageWrapper wide>
              <ProtectedRoute>
                <MisReportesScreen />
              </ProtectedRoute>
            </PageWrapper>
          } />

          <Route path="/reporte/:id" element={
            <PageWrapper>
              <ProtectedRoute>
                <DetalleReporteScreen />
              </ProtectedRoute>
            </PageWrapper>
          } />

          {/* ✅ NUEVA RUTA /profile */}
          <Route path="/profile" element={
            <PageWrapper wide>
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            </PageWrapper>
          } />
          

          <Route path="/municipality/admin/*" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/municipality/operator/*" element={
            <ProtectedRoute>
              <OperatorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/superadmin/*" element={
            <ProtectedRoute>
              <SuperDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App