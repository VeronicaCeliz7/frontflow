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
import { ThemeProvider } from './components/context/ThemeContext'

function RoleRouter() {
  const { user, isLoaded } = useUser()
  const location = useLocation()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  const role = user?.publicMetadata?.role as string | undefined

  const isSuperAdmin = role === 'superadmin'
  const isAdmin = role === 'admin'
  const isOperator = role === 'operator' || role === 'operador'

  if (isSuperAdmin && !location.pathname.startsWith('/superadmin')) {
    return <Navigate to="/superadmin" replace />
  }

  if (isAdmin && location.pathname === '/login') {
  return <Navigate to="/municipality/admin" replace />
}

  if (isOperator && location.pathname === '/login') {
  return <Navigate to="/municipality/operator" replace />
}

  return <HomeScreen />
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><Navigate to="/login" replace /></SignedOut>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
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
          <PageWrapper>
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
            <ThemeProvider>
              <SuperDashboard />
            </ThemeProvider>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}
function PageWrapper({ children, wide = false }: { children: React.ReactNode, wide?: boolean }) {
  const { user } = useUser()
  const navigate = useNavigate()

  const role = user?.publicMetadata?.role as string | undefined
  const roles = (user?.publicMetadata?.roles as string[]) || []

  const isSuperAdmin = role === 'superadmin' || roles.includes('superadmin')
  const isAdmin = role === 'admin' || roles.includes('admin')
  const isOperator =
    role === 'operator' ||
    role === 'operador' ||
    roles.includes('operator') ||
    roles.includes('operador')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <header className="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">

          <div className="flex gap-2">

            {(isAdmin || isSuperAdmin) && (
              <button
                onClick={() => navigate('/municipality/admin')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                🏛️ Administrador
              </button>
            )}

            {(isOperator || isSuperAdmin) && (
              <button
                onClick={() => navigate('/municipality/operator')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                👷 Operador
              </button>
            )}

            {isSuperAdmin && (
              <button
                onClick={() => navigate('/superadmin')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition"
              >
                👑 Superadministrador
              </button>
            )}

            {(isAdmin || isOperator || isSuperAdmin) && (
              <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
           >
              🧑 Ciudadano
           </button>
            )}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className={`relative z-10 w-full ${wide ? 'max-w-6xl' : 'max-w-md'} px-4`}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default App