import './App.css';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import HomeScreen from './components/HomeScreen';
import CrearReporteScreen from './components/CrearReporteScreen';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <header className="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 py-4 flex justify-end items-center">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </header>

        <main className="relative min-h-screen flex items-center justify-center pt-20">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
          </div>

          <Routes>
            <Route path="/login" element={
              <div className="relative z-10 w-full max-w-md px-4">
                <SignedOut>
                  <LoginScreen />
                </SignedOut>
              </div>
            } />
            
            <Route path="/sign-up" element={
              <div className="relative z-10 w-full max-w-md px-4">
                <SignedOut>
                  <SignUpScreen />
                </SignedOut>
              </div>
            } />
            
            <Route path="/" element={
              <div className="relative z-10 w-full max-w-md px-4">
                <SignedOut>
                  <LoginScreen />
                </SignedOut>
                <SignedIn>
                  <HomeScreen />
                </SignedIn>
              </div>
            } />
            
            {/* Ruta para crear reporte - con ancho completo */}
            <Route path="/nuevo-reporte" element={
              <div className="relative z-10 w-full max-w-6xl px-4">
                <SignedIn>
                  <CrearReporteScreen />
                </SignedIn>
              </div>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;