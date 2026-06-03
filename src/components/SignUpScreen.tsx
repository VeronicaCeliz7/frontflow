// src/components/SignUpScreen.tsx
import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import UrbanFlowLogo from './UrbanFlowLogo';

const SignUpScreen = () => {
  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <div className="flex justify-center">
        <UrbanFlowLogo size="large" showText={true} />
      </div>
      
      {/* Formulario de Clerk - estilos minimalistas */}
      <SignUp 
        routing="virtual"
        signInUrl="/login"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-white border border-gray-200 rounded-lg shadow-none",
            headerTitle: "text-gray-900 text-xl font-semibold",
            headerSubtitle: "text-gray-500",
            formFieldLabel: "text-gray-700 text-sm font-medium",
            formFieldInput: "bg-white border-gray-300 text-gray-900 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
            formButtonPrimary: "w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors",
            footerActionLink: "text-blue-600 hover:text-blue-700",
            dividerLine: "bg-gray-200",
            dividerText: "text-gray-400 text-xs",
          }
        }}
      />
      
      {/* Enlace para iniciar sesión */}
      <p className="text-gray-500 text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-blue-600 hover:text-blue-700">
          Inicia sesión
        </Link>
      </p>
      
      <p className="text-gray-400 text-xs text-center mt-4">
        Secured by Clerk
      </p>
    </div>
  );
};

export default SignUpScreen;