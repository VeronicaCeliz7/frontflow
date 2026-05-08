// src/components/SignUpScreen.tsx
import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import UrbanFlowLogo from './UrbanFlowLogo';

const SignUpScreen = () => {
  return (
    <div className="text-center space-y-6">
      <div className="flex flex-col items-center gap-3">
        <UrbanFlowLogo size="large" />
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">
            <span className="text-white">URBAN</span>
            <span className="text-blue-500">FLOW</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Crea tu cuenta para reportar incidencias
          </p>
        </div>
      </div>
      
      <SignUp 
        routing="virtual"
        signInUrl="/login"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl",
            headerTitle: "text-white text-xl font-semibold",
            headerSubtitle: "text-gray-300",
            formFieldLabel: "text-gray-200 text-sm",
            formFieldInput: "bg-white/20 border-white/30 text-white rounded-lg",
            formButtonPrimary: "w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition",
            footerActionLink: "text-blue-400 hover:text-blue-300",
            dividerLine: "bg-white/20",
            dividerText: "text-gray-400 text-xs",
          }
        }}
      />
      
      <p className="text-gray-400 text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-blue-400 hover:text-blue-300">
          Inicia sesión
        </Link>
      </p>
      
      <p className="text-gray-500 text-xs text-center mt-4">
        Secured by Clerk
      </p>
    </div>
  );
};

export default SignUpScreen;