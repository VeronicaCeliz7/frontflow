import './App.css'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'  // ← Agregado useNavigate
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

// ── RoleRouter: lee el rol y redirige a la pantalla correcta ──
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

  const role = user?.publicMetadata?.role as string

  // SUPERADMIN: solo redirige a /superadmin si NO está tratando de ir a "/"
  if (role === 'superadmin' && location.pathname !== '/') {
    return <Navigate to="/superadmin" replace />
  }

  // ADMIN y OPERATOR: redirigen siempre a su panel
  if (role === 'admin') return <Navigate to="/municipality/admin" replace />
  if (role === 'operator') return <Navigate to="/municipality/operator" replace />

  // Ciudadano o sin rol especial
  return <HomeScreen />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Rutas del ciudadano ───────────────────────────── */}
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
            <SignedIn><CrearReporteScreen /></SignedIn>
            <SignedOut><Navigate to="/login" replace /></SignedOut>
          </PageWrapper>
        } />

        <Route path="/mis-reportes" element={
          <PageWrapper>
            <SignedIn><MisReportesScreen /></SignedIn>
            <SignedOut><Navigate to="/login" replace /></SignedOut>
          </PageWrapper>
        } />

        <Route path="/reporte/:id" element={
          <PageWrapper>
            <SignedIn><DetalleReporteScreen /></SignedIn>
            <SignedOut><Navigate to="/login" replace /></SignedOut>
          </PageWrapper>
        } />

        {/* ── Rutas del municipio (sin PageWrapper, tienen su propio layout) ── */}
        <Route path="/municipality/admin/*" element={
          <SignedIn><AdminDashboard /></SignedIn>
        } />

        <Route path="/municipality/operator/*" element={
          <SignedIn><OperatorDashboard /></SignedIn>
        } />

        {/* ── Ruta de superadmin (con ThemeProvider) ── */}
        <Route path="/superadmin/*" element={
          <SignedIn>
            <ThemeProvider>
              <SuperDashboard />
            </ThemeProvider>
          </SignedIn>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

// ── PageWrapper: layout con fondo oscuro para las pantallas del ciudadano ──
function PageWrapper({ children, wide = false }: { children: React.ReactNode, wide?: boolean }) {
  const { user } = useUser()
  const navigate = useNavigate()
  const role = user?.publicMetadata?.role

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <header className="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* Botón para volver al Superdashboard (solo superadmin) */}
          {role === 'superadmin' && (
            <button
              onClick={() => navigate('/superadmin')}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition"
            >
              👑 Volver a Superadmin
            </button>
          )}

          <div className="flex items-center gap-4 ml-auto">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className={`relative z-10 w-full ${wide ? 'max-w-6xl' : 'max-w-md'} px-4`}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default App