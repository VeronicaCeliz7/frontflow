import './App.css';
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/clerk-react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { ThemeProvider } from './components/context/ThemeContext';

import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomeScreen from './components/HomeScreen';
import CrearReporteScreen from './components/CrearReporteScreen';
import MisReportesScreen from './components/MisReportesScreen';
import DetalleReporteScreen from './components/DetalleReporteScreen';

import SuperDashboard from './components/super/SuperDashboard';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          {/* SUPER USUARIO */}
          <Route
            path="/super"
            element={
              <>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>

                <SignedIn>
                  <SuperDashboard />
                </SignedIn>
              </>
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <AppShell maxWidth="max-w-md">
                <SignedOut>
                  <LoginScreen />
                </SignedOut>

                <SignedIn>
                  <Navigate to="/" replace />
                </SignedIn>
              </AppShell>
            }
          />

          {/* REGISTER */}
          <Route
            path="/sign-up"
            element={
              <AppShell maxWidth="max-w-md">
                <SignedOut>
                  <SignUpScreen />
                </SignedOut>

                <SignedIn>
                  <Navigate to="/" replace />
                </SignedIn>
              </AppShell>
            }
          />

          {/* HOME */}
          <Route
            path="/"
            element={
              <AppShell maxWidth="max-w-md">
                <SignedOut>
                  <LoginScreen />
                </SignedOut>

                <SignedIn>
                  <RoleRedirect />
                </SignedIn>
              </AppShell>
            }
          />

          {/* NUEVO REPORTE */}
          <Route
            path="/nuevo-reporte"
            element={
              <AppShell maxWidth="max-w-6xl">
                <SignedIn>
                  <CrearReporteScreen />
                </SignedIn>
              </AppShell>
            }
          />

          {/* MIS REPORTES */}
          <Route
            path="/mis-reportes"
            element={
              <AppShell maxWidth="max-w-4xl">
                <SignedIn>
                  <MisReportesScreen />
                </SignedIn>
              </AppShell>
            }
          />

          {/* DETALLE */}
          <Route
            path="/reporte/:id"
            element={
              <AppShell maxWidth="max-w-4xl">
                <SignedIn>
                  <DetalleReporteScreen />
                </SignedIn>
              </AppShell>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function RoleRedirect() {
  const { user } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress;

  const superUsers = [
    'gabrielfernandezlbz@gmail.com',
  ];

  if (email && superUsers.includes(email)) {
    return <Navigate to="/super" replace />;
  }

  return <HomeScreen />;
}

function AppShell({
  children,
  maxWidth,
}: {
  children: React.ReactNode;
  maxWidth: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      {/* HEADER */}
      <header className="fixed left-0 right-0 top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-end px-6 py-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative flex min-h-screen items-center justify-center px-4 pt-20">

        {/* GRID BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden opacity-20">

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

        </div>

        {/* CONTENT */}
        <div className={`relative z-10 w-full ${maxWidth}`}>
          {children}
        </div>

      </main>
    </div>
  );
}

export default App;