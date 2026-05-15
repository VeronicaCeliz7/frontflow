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
      {/* Logo - el componente ya incluye el texto "URBANFLOW" y el subtítulo */}
      <UrbanFlowLogo size="large" showText={true} />
      
      {/* Formulario de Clerk con registro habilitado */}
      <SignIn 
        routing="virtual"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl",
            headerTitle: "text-white text-xl font-semibold",
            headerSubtitle: "text-gray-300",
            formFieldLabel: "text-gray-200 text-sm",
            formFieldInput: "bg-white/20 border-white/30 text-white rounded-lg",
            formButtonPrimary: "w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition",
            socialButtonsBlockButton: "bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl",
            footerActionLink: "text-blue-400 hover:text-blue-300",
            dividerLine: "bg-white/20",
            dividerText: "text-gray-400 text-xs",
          }
        }}
      />
      
      {/* Enlace para registrarse */}
      <p className="text-gray-400 text-sm">
        ¿No tienes cuenta?{' '}
        <Link to="/sign-up" className="text-blue-400 hover:text-blue-300">
          Regístrate
        </Link>
      </p>
      
      <p className="text-gray-500 text-xs text-center mt-4">
        Secured by Clerk
      </p>
    </div>
  );
};

export default LoginScreen;