// src/components/UrbanFlowLogo.tsx
interface UrbanFlowLogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const UrbanFlowLogo = ({ 
  size = 'medium',
  className = ''
}: UrbanFlowLogoProps) => {
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Fondo circular azul suave */}
        <circle cx="50" cy="50" r="48" fill="#E8F0FE" />
        
        {/* Cuadrícula de ciudad (calles) */}
        <g stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
          {/* Líneas verticales */}
          <line x1="30" y1="20" x2="30" y2="80" />
          <line x1="50" y1="20" x2="50" y2="80" />
          <line x1="70" y1="20" x2="70" y2="80" />
          {/* Líneas horizontales */}
          <line x1="20" y1="35" x2="80" y2="35" />
          <line x1="20" y1="50" x2="80" y2="50" />
          <line x1="20" y1="65" x2="80" y2="65" />
        </g>
        
        {/* Marcador de Google Maps (gota con círculo interno) */}
        <g transform="translate(50, 45)">
          {/* Cuerpo del marcador (gota) */}
          <path
            d="M0,-20 C12,-10 18,4 18,14 C18,24 10,30 0,30 C-10,30 -18,24 -18,14 C-18,4 -12,-10 0,-20Z"
            fill="#EA4335"
          />
          {/* Círculo interno blanco */}
          <circle cx="0" cy="12" r="6" fill="white" />
          {/* Punto central azul */}
          <circle cx="0" cy="12" r="3" fill="#3B82F6" />
        </g>
      </svg>
    </div>
  );
};

export default UrbanFlowLogo;