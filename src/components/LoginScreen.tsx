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
      
      {/* Formulario de Clerk - estilos shadcn con modo oscuro */}
      <SignIn 
        routing="virtual"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-none",
            headerTitle: "text-gray-900 dark:text-gray-100 text-xl font-semibold",
            headerSubtitle: "text-gray-500 dark:text-gray-400",
            formFieldLabel: "text-gray-700 dark:text-gray-300 text-sm font-medium",
            formFieldInput: "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
            formButtonPrimary: "w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors",
            socialButtonsBlockButton: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors",
            footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
            dividerLine: "bg-gray-200 dark:bg-gray-700",
            dividerText: "text-gray-400 dark:text-gray-500 text-xs",
          }
        }}
      />
      
      {/* Enlace para registrarse */}
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        ¿No tienes cuenta?{' '}
        <Link to="/sign-up" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
          Regístrate
        </Link>
      </p>
      
      <p className="text-gray-400 dark:text-gray-500 text-xs text-center mt-4">
        Secured by Clerk
      </p>
    </div>
  );
};

export default LoginScreen;