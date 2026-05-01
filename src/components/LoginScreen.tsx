// src/components/LoginScreen.tsx
import { SignIn } from '@clerk/clerk-react';
import UrbanFlowLogo from './UrbanFlowLogo';

const LoginScreen = () => {
  return (
    <div className="text-center space-y-6">
      {/* Logo + texto */}
      <div className="flex flex-col items-center gap-3">
        <UrbanFlowLogo size="large" />
        <div>
          <h1 className="text-3xl font-bold tracking-tighter">
            <span className="text-white">URBAN</span>
            <span className="text-blue-500">FLOW</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Reporta incidencias en tu ciudad
          </p>
        </div>
      </div>
      
      {/* Formulario de Clerk */}
      <SignIn 
        routing="virtual"
        signUpUrl="/"
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
      
      <p className="text-gray-500 text-xs text-center mt-4">
        Secured by Clerk
      </p>
    </div>
  );
};

export default LoginScreen;