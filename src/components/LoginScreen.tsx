// src/components/LoginScreen.tsx
import { SignIn, useAuth } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import UrbanFlowLogo from './UrbanFlowLogo';

const LoginScreen = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <UrbanFlowLogo size="large" showText={true} />
      
      {/* Formulario de Clerk - estilos shadcn minimalistas */}
      <SignIn 
        routing="virtual"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-white border border-gray-200 rounded-lg shadow-none",
            headerTitle: "text-gray-900 text-xl font-semibold",
            headerSubtitle: "text-gray-500",
            formFieldLabel: "text-gray-700 text-sm font-medium",
            formFieldInput: "bg-white border-gray-300 text-gray-900 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
            formButtonPrimary: "w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors",
            socialButtonsBlockButton: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors",
            footerActionLink: "text-blue-600 hover:text-blue-700",
            dividerLine: "bg-gray-200",
            dividerText: "text-gray-400 text-xs",
          }
        }}
      />
      
      {/* Enlace para registrarse */}
      <p className="text-gray-500 text-sm">
        ¿No tienes cuenta?{' '}
        <Link to="/sign-up" className="text-blue-600 hover:text-blue-700">
          Regístrate
        </Link>
      </p>
      
      <p className="text-gray-400 text-xs text-center mt-4">
        Secured by Clerk
      </p>
    </div>
  );
};

export default LoginScreen;