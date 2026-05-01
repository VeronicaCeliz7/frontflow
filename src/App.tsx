import './App.css';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header solo con UserButton */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-end items-center">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      {/* Fondo con cuadrícula */}
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

        <div className="relative z-10 w-full max-w-md px-4">
          <SignedOut>
            <LoginScreen />
          </SignedOut>
          <SignedIn>
            <HomeScreen />
          </SignedIn>
        </div>
      </main>
    </div>
  );
}

export default App;